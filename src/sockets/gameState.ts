import {GameGrid} from "./gameGrid";
import {GameGridLayout} from "../types/gamestate";
import {Player} from "./player";
import {LetterBag} from "./letterBag";
import {CurrentPlayer} from "./currentPlayer";
import {
  EmptyGameGridItem,
  FilledGameGridItem,
  GameGridElement, GameGridItem,
  Letter,
  LocalPlayer
} from "../../sharedTypes/sharedTypes";
import {gridHelpers} from "./gridHelpers";
import {EmptyTile} from "./specialTiles";
import {nanoid} from "nanoid";
import {GameStateHelpers} from "./gameStateHelpers";
import {SPECIAL_COORDINATES} from "./specialCoordinates";
import {State} from "./state";

const castGridItem = GameStateHelpers.castGridItem;

class EndOfGameManager {
  allLettersUsed: boolean;
  hasEnded: boolean;
  playerAtStartOfLoop: Player;
  lettersPlacedAtStartOfLastLoop: number;

  checkIfEnded(playerId: string, lettersPlaced: number) {
    if (playerId === this.playerAtStartOfLoop.playerId) {
      if (lettersPlaced === this.lettersPlacedAtStartOfLastLoop) {
        this.hasEnded = true;
      } else {
        this.lettersPlacedAtStartOfLastLoop = lettersPlaced;
      }
    }
  }
}

export class GameState {
  private readonly _gameId: string;
  private readonly _activeGrid: GameGrid;
  private readonly _baseGrid: GameGridLayout<EmptyGameGridItem>;
  private _players: Player[];
  private _letterBag: LetterBag;
  private _currentPlayer!: CurrentPlayer;
  private _inviteCode!: string;
  private _letterCount: number;
  private _turnIndex: number;
  private _lettersPlacedInTurn: number[];
  private _errors: string[];
  private _endOfGameManager: EndOfGameManager;

  constructor(gameId: string) {
    this._gameId = gameId;
    this._activeGrid = new GameGrid();
    this._baseGrid = {};
    this._players = [];
    this._letterBag = new LetterBag();
    this._letterCount = 0;
    this._turnIndex = 0;
    this._lettersPlacedInTurn = [];
    this._errors = [];
    this._endOfGameManager = new EndOfGameManager();
  }

  static initialise(players: LocalPlayer[], gameId: string): GameState | null {
    const gameState = new GameState(gameId);

    // initialise grid
    for (let i = 0; i < 15 * 15; i++) {
      const initialCoordinate = gridHelpers.indexToXY(i);
      const mirroredCoordinates = gridHelpers.mirrorCoordinates(initialCoordinate.x, initialCoordinate.y);

      const gridElement: GameGridElement<EmptyGameGridItem> = {
        gridItem: SPECIAL_COORDINATES[mirroredCoordinates[0].y][mirroredCoordinates[0].x] ?? EmptyTile,
        index: i,
      };

      gameState._activeGrid.grid[i] = gridElement;

      // Needs a copy otherwise they point to the same reference
      // and changes to activegrid propagate in basegrid. Needs a
      // deep copy because this same gridElement is used 4 times
      // and any modification to one of them propagates in all 4.
      // ty stackoverflow https://stackoverflow.com/a/38874807
      gameState._baseGrid[i] = {...gridElement, gridItem: {...gridElement.gridItem}};
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

  get gameId(): string {
    return this._gameId;
  }

  private _getPlayer(playerId: string): Player | undefined {
    return this._players.find(x => x.playerId === playerId);
  }

  private _getCurrentPlayer() {
    return this._players[this._currentPlayer.index];
  }

  private _validateLetter(gridIndex: number, playerId: string, value: Letter) {
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

    if (value.value !== 0 && !targetPlayer.letters.hasLetter(value.letter, value.value)) {
      return false;
    } else if (value.value === 0 && !targetPlayer.letters.hasLetterWhere(x => x.value === 0)) {
      return false;
    }

    if (this._turnIndex === 0) {
      const coordinates = GameStateHelpers.indexToXY(gridIndex);

      if (coordinates.y !== 7) {
        return false;
      }
    }

    return targetIndex.gridItem.empty;
  }

  placeLetter(gridIndex: number, playerId: string, value: Letter, oldGridIndex?: number): GameState {
    if (!this._validateLetter(gridIndex, playerId, value)) {
      if (oldGridIndex !== undefined) {
        return this._placeLetterInternal(oldGridIndex, playerId, value);
      }

      return this;
    }

    return this._placeLetterInternal(gridIndex, playerId, value);
  }

  private _placeLetterInternal(gridIndex: number, playerId: string, value: Letter): GameState {
    this._activeGrid.grid[gridIndex].gridItem = {
      empty: false,
      letter: value.letter,
      value: value.value,
      playerId: playerId,
      orderIndex: this._letterCount,
      turnIndex: this._turnIndex
    };

    if (value.value === 0) {
      this._getCurrentPlayer().letters.removeLetterWhere(x => x.value === 0);
    } else {
      this._getCurrentPlayer().letters.removeLetter(value);
    }

    this._lettersPlacedInTurn.push(gridIndex);
    this._lettersPlacedInTurn.sort();
    this._letterCount++;
    return this;
  }

  removeBoardLetter(gridIndex: number, playerId: string, isBeingMoved: boolean): GameState {
    const gridItem = this._activeGrid.grid[gridIndex];

    if (gridItem.gridItem.empty === false && gridItem.gridItem.playerId === playerId && this._lettersPlacedInTurn.includes(gridIndex)) {
      const targetPlayer = this._players.find(x => x.playerId === playerId);

      targetPlayer!.letters.addLetter({
        letter: gridItem.gridItem.value === 0 && !isBeingMoved ? "" : gridItem.gridItem.letter,
        value: gridItem.gridItem.value,
      });

      this._activeGrid.grid[gridIndex].gridItem = this._baseGrid[gridIndex].gridItem;

      this._lettersPlacedInTurn = this._lettersPlacedInTurn.filter(x => x !== gridIndex);
      this._letterCount--;
    }

    return this;
  }

  private _calculateWordScore(word: GameGridElement<FilledGameGridItem>[]) {
    let wordScore = 0;

    for (const letter of word) {
      const specialTile = this._baseGrid[letter.index].gridItem;

      if (specialTile.type === 'letter' && specialTile.multiplierEnabled) {
        wordScore += (letter.gridItem.value * specialTile.multiplier);
        specialTile.multiplierEnabled = false;
      } else {
        wordScore += letter.gridItem.value;
      }
    }
    for (const letter of word) {
      const specialTile = this._baseGrid[letter.index].gridItem;

      if (specialTile.type === 'word' && specialTile.multiplierEnabled) {
        wordScore *= specialTile.multiplier;
        specialTile.multiplierEnabled = false;
      }
    }

    return wordScore;
  }

  private _validateLetterIsNotIsolated(word: GameGridElement<FilledGameGridItem>[], letter: GameGridElement<FilledGameGridItem>): boolean {
    const surroundingCoordinates = GameStateHelpers.getSurroundingCoordinatesAsArray(letter.index);

    for (const surroundingCoordinate of surroundingCoordinates) {
      const index = GameStateHelpers.XYToIndex(surroundingCoordinate);
      const surroundingGridElement = this._activeGrid.grid[index];

      if (surroundingGridElement && !surroundingGridElement.gridItem.empty) {
        if (word.find(x => x.gridItem.orderIndex === castGridItem<FilledGameGridItem>(surroundingGridElement).gridItem.orderIndex) === undefined) {
          return true;
        }
      }
    }

    return false;
  }

  private async _processWord(word: GameGridElement<FilledGameGridItem>[]) {
    const wordJoined = word.map(x => x.gridItem.letter).join("");
    const isValidWord = await GameStateHelpers.checkWord(wordJoined);
    const isValidPlacement = word.some(x => this._validateLetterIsNotIsolated(word, x));

    if (!isValidWord) {
      this._errors.push(`${wordJoined.toLowerCase()} is not a valid word`);
      return -1;
    }

    if (!isValidPlacement && this._turnIndex !== 0) {
      this._errors.push(`Invalid placement of ${wordJoined.toLowerCase()}`);
      return -1;
    }

    return this._calculateWordScore(word);
  }

  private async _processLineWords(line: GameGridElement<GameGridItem>[], targetGridElement: GameGridElement<FilledGameGridItem>, wordsProcessed: number[]) {
    const lineWords = GameStateHelpers.getLineWords(line);

    const targetWord = lineWords.find(x => x.filter(x => x.index === targetGridElement.index).length > 0);

    const targetWordId = targetWord.reduce((a, b) => a + (b.index + b.gridItem.value), 0);

    if (targetWord.length > 1 && !wordsProcessed.includes(targetWordId)) {
      const wordScore = await this._processWord(targetWord);

      if (wordScore !== -1) {
        this._players[this._currentPlayer.index].score += wordScore;
      }

      wordsProcessed.push(targetWordId);
    }
  }

  private async _processPlacedLetters() {
    const gridParsed = this._activeGrid.parseGrid();

    const wordsProcessed = [];

    for (const gridIndex of this._lettersPlacedInTurn) {
      const gridElement = castGridItem<FilledGameGridItem>(this._activeGrid.grid[gridIndex]);
      const {x, y} = GameStateHelpers.indexToXY(gridIndex);

      const row = gridParsed.rows[y];
      const column = gridParsed.columns[x];

      await this._processLineWords(row, gridElement, wordsProcessed);
      await this._processLineWords(column, gridElement, wordsProcessed);
    }
  }

  private _resetTurn() {
    for (const index of this._lettersPlacedInTurn) {
      const placedLetter = castGridItem<FilledGameGridItem>(this._activeGrid.grid[index]);
      this.removeBoardLetter(index, placedLetter.gridItem.playerId, false);
    }
  }

  async processTurn(): Promise<string[]> {
    this._errors = [];

    if (this._turnIndex === 0) {
      if (this._lettersPlacedInTurn.some(x => x === 112) === false && this._lettersPlacedInTurn.length > 0) {
        this._errors.push("Invalid Placement");
        this._resetTurn();
        return this._errors;
      }
    }

    await this._processPlacedLetters();

    if (this._errors.length > 0) {
      this._resetTurn();
      return this._errors;
    }

    this._lettersPlacedInTurn = [];

    if (this._endOfGameManager.allLettersUsed) {
      this._endOfGameManager.checkIfEnded(this._getCurrentPlayer().playerId, this._letterCount);

      if (this._getCurrentPlayer().letters.letters.length === 0) {
        this._endOfGameManager.hasEnded = true;

        for (const player of this._players) {
          const total = player.letters.getTotal();
          player.score -= total;
        }
      }
    }

    if (!this._letterBag.hasLettersLeft() && !this._endOfGameManager.allLettersUsed) {
      this._endOfGameManager.allLettersUsed = true;
      this._endOfGameManager.playerAtStartOfLoop = this._getCurrentPlayer();
      this._endOfGameManager.lettersPlacedAtStartOfLastLoop = this._letterCount;
    }

    this._givePlayerLetters(this._getCurrentPlayer().playerId);

    this._currentPlayer.nextPlayer();
    this._turnIndex++;

    return this._errors;
  }

  removePlayerLetters(playerId: string, ...letters: Letter[]) {
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
      return;
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
    return new State(this._activeGrid.grid, this._players, this._getCurrentPlayer().playerId, this._endOfGameManager.allLettersUsed, this._endOfGameManager.hasEnded);
  }
}
