import {GameGrid} from "./gameGrid";
import {GameError, GameGridElement, GameGridLayout, Lines, WordScore} from "../types/gamestate";
import {Player} from "./player";
import {LetterBag} from "./letterBag";
import {CurrentPlayer} from "./currentPlayer";
import {Letter as SharedLetter, LocalPlayer} from "../../sharedTypes/sharedTypes";
import {gridHelpers} from "./gridHelpers";
import {EmptyTile} from "./specialTiles";
import {nanoid} from "nanoid";
import {GameStateHelpers, wordCache} from "./gameStateHelpers";
import {SPECIAL_COORDINATES} from "./specialCoordinates";
import {State} from "./state";

const isNotEmpty = GameStateHelpers.isNotEmpty;
const isEmpty = GameStateHelpers.isEmpty;

export class GameState {
  private readonly _activeGrid: GameGrid;
  private readonly _baseGrid: GameGridLayout;
  private _players: Player[];
  private _letterBag: LetterBag;
  private _currentPlayer: CurrentPlayer;
  private _inviteCode: string;
  private _letterCount: number;
  private _turnCount: number;
  private _lettersPlacedInTurn: number[];
  private _errors: string[];

  constructor() {
    this._activeGrid = new GameGrid();
    this._baseGrid = {};
    this._players = [];
    this._letterBag = new LetterBag();
    this._letterCount = 0;
    this._turnCount = 0;
    this._lettersPlacedInTurn = [];
    this._errors = [];
  }

  static initialise(players: LocalPlayer[]): GameState | null {
    const gameState = new GameState();

    // initialise grid
    for (let i = 0; i < 15 * 15; i++) {
      const initialCoordinate = gridHelpers.indexToXY(i);
      const mirroredCoordinates = gridHelpers.mirrorCoordinates(initialCoordinate.x, initialCoordinate.y);

      const gridIndex = {
        gridItem: SPECIAL_COORDINATES[mirroredCoordinates[0].y][mirroredCoordinates[0].x] ?? EmptyTile,
        index: i,
      };

      gameState._activeGrid.grid[i] = gridIndex;

      // Needs a shallow copy otherwise they point to the same reference
      // and changes to activegrid propagate in basegrid
      gameState._baseGrid[i] = {...gridIndex};
    }

    // initialise players
    gameState._players = players
      .filter(x => x.type === 'Human' || x.type === 'Ai')
      .map(x => Player.initialise(x, gameState._letterBag));

    if (gameState._players.length === 0) {
      return null;
    }

    gameState._inviteCode = nanoid(4);
    gameState._currentPlayer = new CurrentPlayer(0, gameState._players.length - 1);

    return gameState;
  }

  get inviteCode(): string {
    return this._inviteCode;
  }

  private _getPlayer(playerId: string): Player | null {
    return this._players.find(x => x.playerId === playerId);
  }

  private _getCurrentPlayer() {
    return this._players[this._currentPlayer.index];
  }

  private _validateLetter(gridIndex: number, playerId: string, value: SharedLetter) {
    if (playerId !== this._getCurrentPlayer().playerId) {
      return false;
    }

    const targetPlayer = this._getPlayer(playerId);

    if (!targetPlayer) {
      return false;
    }

    const targetIndex = this._activeGrid.grid[gridIndex];

    if (!targetIndex) {
      return false;
    }

    if (!targetPlayer.playerHasLetter(value.letter, value.value)) {
      return false;
    }

    if (this._turnCount === 0) {
      const coordinates = GameStateHelpers.indexToXY(gridIndex);

      if (coordinates.y !== 7) {
        return false;
      }
    }

    return targetIndex.gridItem.empty;
  }

  placeLetter(gridIndex: number, playerId: string, value: SharedLetter): GameState {
    if (!this._validateLetter(gridIndex, playerId, value)) {
      return this;
    }

    this._activeGrid.grid[gridIndex].gridItem = {
      empty: false,
      letter: value.letter,
      value: value.value,
      playerId: playerId,
      orderIndex: this._letterCount,
      turnIndex: this._turnCount
    };

    this._getCurrentPlayer().letters.removeLetter(value);
    this._lettersPlacedInTurn.push(gridIndex);
    this._letterCount++;
    return this;
  }

  removeBoardLetter(gridIndex: number, playerId: string): GameState {
    const gridItem = this._activeGrid.grid[gridIndex];

    if (gridItem.gridItem.empty === false && gridItem.gridItem.playerId === playerId && this._lettersPlacedInTurn.includes(gridIndex)) {
      const targetPlayer = this._players.find(x => x.playerId === playerId);

      targetPlayer.letters.addLetter({
        letter: gridItem.gridItem.letter,
        value: gridItem.gridItem.value,
      });

      this._activeGrid.grid[gridIndex].gridItem = this._baseGrid[gridIndex].gridItem;

      this._lettersPlacedInTurn = this._lettersPlacedInTurn.filter(x => x !== gridIndex);
    }

    return this;
  }

  private async _checkIfWordWasAmended(word: GameGridElement[]) {
    if (!word.every(x => isNotEmpty(x.gridItem).turnIndex === isNotEmpty(word[0].gridItem).turnIndex)
      && word.some(x => this._lettersPlacedInTurn.includes(x.index))) {

      const preAmendWord = [];

      for (let gameStateGridElement of word) {
        if (isNotEmpty(gameStateGridElement.gridItem).turnIndex !== this._turnCount) {
          preAmendWord.push(gameStateGridElement);
        }
      }

      return await GameStateHelpers.checkWord(preAmendWord.map(x => isNotEmpty(x.gridItem).letter).join(""));
    }

    return false;
  }

  private async _calculateWordScore(word: GameGridElement[], playerId: string) {
    let wordScore = 0;

    const wordWasAmended = await this._checkIfWordWasAmended(word);

    for (const letter of word) {
      const specialTile = isEmpty(this._baseGrid[letter.index].gridItem);

      if (specialTile.type === 'letter' && (specialTile.multiplierClaimant === playerId || specialTile.multiplierClaimant === '')) {
        if (wordWasAmended) {
          specialTile.multiplier = 1;
        }

        wordScore += (isNotEmpty(letter.gridItem).value * specialTile.multiplier);
        specialTile.multiplierClaimant = playerId;
      } else {
        wordScore += isNotEmpty(letter.gridItem).value;
      }
    }

    for (const letter of word) {
      const specialTile = isEmpty(this._baseGrid[letter.index].gridItem);

      if (specialTile.type === 'word' && specialTile.multiplierClaimant === playerId || specialTile.multiplierClaimant === '') {
        if (wordWasAmended) {
          specialTile.multiplier = 1;
        }

        wordScore *= specialTile.multiplier;
        specialTile.multiplierClaimant = playerId;
      }
    }

    return wordScore;
  }

  private async _processLineWords(lineWords: GameGridElement[][]) {
    const wordScores: WordScore[] = [];

    for (const word of lineWords) {
      if (word.length > 1) {
        const wordJoined = word.map(x => isNotEmpty(x.gridItem).letter).join("");
        const checkResult = await GameStateHelpers.checkWord(wordJoined);

        if (!checkResult) {
          this._errors.push(`${wordJoined.toLowerCase()} is not a valid word`);
          continue;
        }

        if (!wordCache.includes(wordJoined)) {
          wordCache.push(wordJoined);
        }

        const lastLetterPlaced = word.find(x => isNotEmpty(x.gridItem).orderIndex === Math.max(...word.map(y => isNotEmpty(y.gridItem).orderIndex)));
        const wordOwner = isNotEmpty(lastLetterPlaced.gridItem).playerId;
        const player = this._getPlayer(wordOwner);

        const wordScore = await this._calculateWordScore(word, player.playerId);

        wordScores.push({
          score: wordScore,
          playerId: player.playerId
        });
      } else if (word.length === 1) {
        const gridElement = word[0];
        const surroundingCoordinates = GameStateHelpers.getSurroundingCoordinatesAsArray(gridElement.index);

        let isIsolated = true;

        for (const surroundingCoordinate of surroundingCoordinates) {
          const index = GameStateHelpers.XYToIndex(surroundingCoordinate);

          if (this._activeGrid.grid.hasOwnProperty(index)) {
            const surroundingGridElement = this._activeGrid.grid[index];

            if (!surroundingGridElement.gridItem.empty) {
              isIsolated = false;
              break;
            }
          }
        }

        if (isIsolated) {
          this._errors.push(`Invalid placement of ${isNotEmpty(gridElement.gridItem).letter}`);
        }
      }
    }

    return wordScores;
  }

  private async _processLines(lines: Lines) {
    let wordScores: WordScore[] = [];

    for (const key in lines) {
      // noinspection JSUnfilteredForInLoop
      const line = lines[key];

      const lineWords = GameStateHelpers.getLineWords(line);

      if (lineWords.length > 0) {
        const scores = await this._processLineWords(lineWords);
        wordScores = [...wordScores, ...scores];
      }
    }

    return wordScores;
  }

  private async _processGrid() {
    const gridParsed = this._activeGrid.parseGrid();

    const columnWordScores = await this._processLines(gridParsed.columns);
    const rowWordScores = await this._processLines(gridParsed.rows);

    return [...columnWordScores, ...rowWordScores];
  }

  private _resetTurn() {
    for (const index of this._lettersPlacedInTurn) {
      const placedLetter = isNotEmpty(this._activeGrid.grid[index].gridItem);
      this.removeBoardLetter(index, placedLetter.playerId);
    }
  }

  async processTurn(): Promise<string[]> {
    this._errors = [];

    if (this._turnCount === 0) {
      if (this._lettersPlacedInTurn.some(x => x === 112) === false && this._lettersPlacedInTurn.length > 0) {
        this._errors.push("Invalid Placement");
        this._resetTurn();
        return this._errors;
      }
    }

    const wordScores = await this._processGrid();

    if (this._errors.length > 0) {
      this._resetTurn();
      return this._errors;
    }

    this._players.forEach(x => x.score = 0);

    for (const wordScore of wordScores) {
      const targetPlayer = this._players.find(x => x.playerId === wordScore.playerId);
      targetPlayer.score += wordScore.score;
    }

    this._lettersPlacedInTurn = [];
    this._givePlayerLetters(this._getCurrentPlayer().playerId);
    this._currentPlayer.nextPlayer();
    this._turnCount++;

    return this._errors;
  }

  removePlayerLetters(playerId: string, ...letters: SharedLetter[]) {
    for (const letter of letters) {
      const player = this._players.find(x => x.playerId === playerId);

      if (player.letters.hasLetter(letter.letter, letter.value)) {
        player.letters.removeLetter(letter);
        this._letterBag.addLetter(letter.letter);
      }
    }

    return this;
  }

  private _givePlayerLetters(playerId: string) {
    const player = this._players.find(x => x.playerId === playerId);

    const totalLetters = player.letters.getTotal();

    if (totalLetters === 7) {
      return this;
    }

    const lettersNeeded = 7 - totalLetters;
    const randomLetters = this._letterBag.getRandomLetters(lettersNeeded);
    player.letters.addLetters(randomLetters);
  }

  givePlayerLetters(playerId: string) {
    this._givePlayerLetters(playerId);
    return this;
  }

  syncState(): State {
    return new State(JSON.stringify(this._activeGrid.grid), this._players, this._getCurrentPlayer().playerId);
  }
}