import React, {MutableRefObject, useRef, useState} from 'react';
import Game from "Pages/game/game";
import {Container} from "Styles/index/styles";
import Letters from "Components/letters";
import {
  ExchangeLettersArgs, GameGridElement, GameGridItem, IWebsocketMethod,
  Letter,
  LocalPlayer,
  PlaceLetterArgs,
  RemoveBoardLetterArgs,
  SharedPlayer
} from "Types/sharedTypes";
import {GameData, IndexStates, SocketOperations} from "Types/index";
import GameLoading from "Components/gameLoading";
import CurrentPlayer from "Components/currentPlayer";
import Scores from "Components/scores";
import MainSection from "Components/mainSection";
import RightSection from "Components/rightSection";
import {w3cwebsocket} from "websocket";
import Errors from "Components/errors";
import GameOver from "Pages/game/gameOver/gameOver";

export default function Index(): JSX.Element {
  console.log("------------------------");

  const [shouldInitSocket, setShouldInitSocket] = useState(true);
  const [grid, setGrid] = useState<GameGridElement<GameGridItem>[]>([]);
  const [loadingState, setLoadingState] = useState<IndexStates>("notLoading");
  const [activeErrors, setActiveErrors] = useState<string[]>([]);
  const [gameIsOver, setGameIsOver] = useState(false);

  // Used because updating the refs below will not cause the component to re-render.
  // Plus, updating the states of the JSX components (game, letters, currentPlayerComponent etc.)
  // without this update check causes the component to re-render infinitely since the conditions
  // for updating pass, then it re-renders and then the conditions pass again, it re-renders again and so on.
  const [updateComponentData, setUpdateComponentData] = useState(false);

  // These have to be created by useRef because they're referenced in callback closures
  // and because of how react hooks work references to a state will become stale
  const currentGameData: MutableRefObject<GameData> = useRef({
    CurrentGame: {
      active: false,
      type: "",
      id: {
        gameId: "",
        socketId: ""
      }
    },
    Players: []
  });

  const socket: MutableRefObject<w3cwebsocket> = useRef(new w3cwebsocket("wss://loc0ded.com/scrabble/"));

  const hasNotAnnouncedOutOfLetters: MutableRefObject<boolean> = useRef(true);

  const updatePlayer = (parsedData: SharedPlayer) => {
    const targetPlayerIndex = currentGameData.current.Players.findIndex(x => x.playerId === parsedData.playerId);

    if (targetPlayerIndex !== -1) {
      currentGameData.current.Players[targetPlayerIndex] = parsedData;
    }
  }

  if (shouldInitSocket) {
    socket.current.onopen = () => {
      console.log("Connected to socket");

      setLoadingState("notLoading");

      socket.current.onmessage = (message) => {
        if (typeof message.data === "string") {
          const messageParsed: IWebsocketMethod = JSON.parse(message.data);

          if (messageParsed.method === "localGameCreated") {
            const argumentsParsed = messageParsed.arguments as {
              grid:  GameGridElement<GameGridItem>[],
              gameId: string,
              players: SharedPlayer[],
              currentPlayer: string
            };

            setGrid(argumentsParsed.grid);

            currentGameData.current.CurrentGame = {
              active: true,
              id: {gameId: argumentsParsed.gameId, socketId: argumentsParsed.players[0].playerId},
              type: "local"
            };

            currentGameData.current.Players = argumentsParsed.players;
            setLoadingState("notLoading");
            setUpdateComponentData(true);
          } else if (messageParsed.method === "gridStateUpdated") {
            const argumentsParsed = messageParsed.arguments as {
              grid: GameGridElement<GameGridItem>[]
            };

            setGrid(argumentsParsed.grid);
            setUpdateComponentData(true);
          } else if (messageParsed.method === "updatePlayer") {
            const k = messageParsed.arguments as {
              player: SharedPlayer
            };

            updatePlayer(k.player);

            setUpdateComponentData(true);
          }
          else if (messageParsed.method === "updatePlayers") {
            const argumentsParsed = messageParsed.arguments as {
              players: SharedPlayer[]
            };

            for (const player of argumentsParsed.players) {
              updatePlayer(player);
            }

            setUpdateComponentData(true);
          }
          else if (messageParsed.method === "endTurn") {
            const argumentsParsed = messageParsed.arguments as {
              currentPlayer: string,
              errors: string[]
            };

            currentGameData.current.CurrentGame.id.socketId = argumentsParsed.currentPlayer;

            setActiveErrors(argumentsParsed.errors);

            setUpdateComponentData(true);
          }
          else if (messageParsed.method === "gameCanEnd") {
            if (hasNotAnnouncedOutOfLetters) {
              hasNotAnnouncedOutOfLetters.current = false;
              alert("You are now out of new letters, the game will end when no more words can be made");
            }
          }
          else if (messageParsed.method === "gameEnded") {
            setGameIsOver(true);
            setUpdateComponentData(true);
          }
        }
      }
    };

    setShouldInitSocket(false);
  }

  socket.current.onclose = () => {
    console.log("Disconnected from socket");
  }

  const send = (data: IWebsocketMethod) => {
    data.arguments = {...data.arguments, ...{id: currentGameData.current.CurrentGame.id}}
    socket.current.send(JSON.stringify(data));
  }

  const createLocalGame = (players: LocalPlayer[]) => {
    send({
      method: "createLocalGame",
      arguments: {
        localPlayers: players
      }
    });
  };

  const placeLetter = (args: PlaceLetterArgs) => {
    send({
      method: "placeLetter",
      arguments: args
    });
  };

  const removeBoardLetter = (args: RemoveBoardLetterArgs) => {
    send({
      method: "removeBoardLetter",
      arguments: args
    });
  };

  const removePlayerLetters = (letters: Letter[]) => {
    send({
      method: "removePlayerLetters",
      arguments: {
        letters
      }
    });
  };

  const endTurn = () => {
    send({
      method: "endTurn",
      arguments: {type: currentGameData.current.CurrentGame.type}
    });
  };

  const exchangeLetters = (args: ExchangeLettersArgs) => {
    removePlayerLetters(args.letters);
    endTurn();
  };

  const socketOperations: SocketOperations = {
    initOperations: {
      createLocalGame
    },
    gameOperations: {
      placeLetter,
      removeBoardLetter,
      endTurn,
      exchangeLetters
    }
  };

  const [game, setGame] = useState(<GameLoading/>);
  const [letters, setLetters] = useState(<Letters letters={[]} gameOperations={socketOperations.gameOperations}/>);
  const [currentPlayerComponent, setCurrentPlayerComponent] = useState<JSX.Element>(<CurrentPlayer
    currentPlayer={""}/>);
  const [score, setScore] = useState(<Scores players={currentGameData.current.Players}/>);
  const [errors, setErrors] = useState(<Errors errors={activeErrors}/>);

  if (updateComponentData) {
    if (gameIsOver) {
      setGame(<GameOver players={currentGameData.current.Players}/>);
    }
    else if (loadingState !== "creatingLocalGame" && grid && Object.keys(grid).length > 0 && currentGameData.current.CurrentGame) {
      setGame(
        <Game grid={grid} players={currentGameData.current.Players}
              currentGame={currentGameData.current.CurrentGame}
              socketOperations={socketOperations.gameOperations}/>
      );
    }

    if (loadingState !== "creatingLocalGame" && currentGameData.current.Players && currentGameData.current.Players.length !== 0 && currentGameData.current.CurrentGame) {
      const currentPlayer = currentGameData.current.Players.find(x => x.playerId === currentGameData.current.CurrentGame.id.socketId);

      if (currentPlayer) {
        setScore(
          <Scores players={currentGameData.current.Players}/>
        );

        setCurrentPlayerComponent(
          <CurrentPlayer currentPlayer={currentPlayer.name}/>
        );

        setLetters(
          <Letters letters={currentPlayer.letters} gameOperations={socketOperations.gameOperations}/>
        );
      }

      setErrors(<Errors errors={activeErrors}/>);
    }

    setUpdateComponentData(false);
  }

  return (
    <Container>
      <MainSection game={game} initOperations={socketOperations.initOperations}/>
      <RightSection errors={errors} letters={letters} gameOperations={socketOperations.gameOperations}
                    scores={score} currentPlayer={currentPlayerComponent}/>
    </Container>
  );
}
