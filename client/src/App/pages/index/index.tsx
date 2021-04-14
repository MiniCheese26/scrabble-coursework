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
  const [socketIsConnected, setSocketIsConnected] = useState(false);
  const [shouldReconnect, setShouldReconnect] = useState(false);
  const [shouldReSync, setShouldReSync] = useState(false);
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

  const socket: MutableRefObject<w3cwebsocket | null> = useRef(null);

  const hasNotAnnouncedOutOfLetters: MutableRefObject<boolean> = useRef(true);

  const o = useRef(true);

  const updatePlayer = (parsedData: SharedPlayer) => {
    const targetPlayerIndex = currentGameData.current.Players.findIndex(x => x.playerId === parsedData.playerId);

    if (targetPlayerIndex !== -1) {
      currentGameData.current.Players[targetPlayerIndex] = parsedData;
    }
  };

  const onLocalGameCreated = (argumentsParsed: {
    grid: GameGridElement<GameGridItem>[],
    gameId: string,
    players: SharedPlayer[],
    currentPlayer: string
  }) => {
    setGrid(argumentsParsed.grid);

    currentGameData.current.CurrentGame = {
      active: true,
      id: {gameId: argumentsParsed.gameId, socketId: argumentsParsed.players[0].playerId},
      type: "local"
    };

    currentGameData.current.Players = argumentsParsed.players;
    setLoadingState("notLoading");
    setUpdateComponentData(true);
  };

  const onGridStateUpdated = (argumentsParsed: {
    grid: GameGridElement<GameGridItem>[]
  }) => {
    setGrid(argumentsParsed.grid);
    setUpdateComponentData(true);
  };

  const onUpdatePlayer = (argumentsParsed: {
    player: SharedPlayer
  }) => {
    updatePlayer(argumentsParsed.player);

    setUpdateComponentData(true);
  };

  const onUpdatePlayers = (argumentsParsed: {
    players: SharedPlayer[]
  }) => {
    for (const player of argumentsParsed.players) {
      updatePlayer(player);
    }

    setUpdateComponentData(true);
  };

  const onEndTurn = (argumentsParsed: {
    currentPlayer: string,
    errors: string[]
  }) => {
    currentGameData.current.CurrentGame.id.socketId = argumentsParsed.currentPlayer;

    setActiveErrors(argumentsParsed.errors);

    setUpdateComponentData(true);
  };

  const onGameCanEnd = () => {
    if (hasNotAnnouncedOutOfLetters.current) {
      hasNotAnnouncedOutOfLetters.current = false;
      alert("You are now out of new letters, the game will end when no more words can be made");
    }
  };

  const onGameEnded = () => {
    setGameIsOver(true);
    setUpdateComponentData(true);
  };

  const onReconnectedAck = (argumentsParsed: {
    success: boolean
  }) => {
    console.log(`reconnection ACK - ${argumentsParsed.success}`)

    if (!argumentsParsed.success) {
      if (currentGameData.current.CurrentGame.active) {
        socket.current?.close();
      }
    } else {
      setShouldReSync(true);
    }

    setUpdateComponentData(true);
  };

  const onSyncState = (argumentsParsed: {
    grid: GameGridElement<GameGridItem>[],
    gameOver: boolean,
    allLettersUsed: boolean,
    players: SharedPlayer[],
    currentPlayer: string
  }) => {
    onGridStateUpdated({grid: argumentsParsed.grid});
    onUpdatePlayers({players: argumentsParsed.players});
    currentGameData.current.CurrentGame.id.socketId = argumentsParsed.currentPlayer;

    if (argumentsParsed.allLettersUsed) {
      onGameEnded();
    }

    if (argumentsParsed.gameOver) {
      onGameEnded();
    }
  };

  const onPlayerLeft = (argumentsParsed: {
    playerName: string
  }) => {
    alert(`Player ${argumentsParsed.playerName} left`);
  };

  if (shouldInitSocket) {
    socket.current = new w3cwebsocket("wss://loc0ded.com/scrabble/ws");

    socket.current.onopen = () => {
      console.log("Connected to socket");

      setLoadingState("notLoading");

      socket.current!.onmessage = (message) => {
        if (typeof message.data === "string") {
          const messageParsed: IWebsocketMethod = JSON.parse(message.data);

          if (messageParsed.method === "localGameCreated") {
            const argumentsParsed = messageParsed.arguments as {
              grid: GameGridElement<GameGridItem>[],
              gameId: string,
              players: SharedPlayer[],
              currentPlayer: string
            };

            onLocalGameCreated(argumentsParsed);
          } else if (messageParsed.method === "gridStateUpdated") {
            const argumentsParsed = messageParsed.arguments as {
              grid: GameGridElement<GameGridItem>[]
            };

            onGridStateUpdated(argumentsParsed);
          } else if (messageParsed.method === "updatePlayer") {
            const argumentsParsed = messageParsed.arguments as {
              player: SharedPlayer
            };

            onUpdatePlayer(argumentsParsed);
          } else if (messageParsed.method === "updatePlayers") {
            const argumentsParsed = messageParsed.arguments as {
              players: SharedPlayer[]
            };

            onUpdatePlayers(argumentsParsed);
          } else if (messageParsed.method === "endTurn") {
            const argumentsParsed = messageParsed.arguments as {
              currentPlayer: string,
              errors: string[]
            };

            onEndTurn(argumentsParsed);
          } else if (messageParsed.method === "gameCanEnd") {
            onGameCanEnd()
          } else if (messageParsed.method === "gameEnded") {
            onGameEnded();
          } else if (messageParsed.method === "reconnectedAck") {
            const argumentsParsed = messageParsed.arguments as {
              success: boolean
            };

            onReconnectedAck(argumentsParsed);
          } else if (messageParsed.method === "syncState") {
            const argumentsParsed = messageParsed.arguments as {
              grid: GameGridElement<GameGridItem>[],
              gameOver: boolean,
              allLettersUsed: boolean,
              players: SharedPlayer[],
              currentPlayer: string
            };

            onSyncState(argumentsParsed);
          } else if (messageParsed.method === "playerLeft") {
            const argumentsParsed = messageParsed.arguments as {
              playerName: string
            };

            onPlayerLeft(argumentsParsed);
          }
        }
      }

      setSocketIsConnected(true);
    };

    socket!.current.onclose = (event) => {
      console.log("Disconnected from socket", event);
      setSocketIsConnected(false);
      setShouldReconnect(true);
      setUpdateComponentData(true);
      setShouldInitSocket(true);
    };

    socket!.current.onerror = (err) => {
      console.log("Error", err);
    };

    setShouldInitSocket(false);
  }

  if (o.current) {
    o.current = false;

    setTimeout(() => {
      console.log("killing");
      socket!.current?.close();
    }, 10000);
  }

  const send = (data: IWebsocketMethod) => {
    data.arguments = {...data.arguments, ...{id: currentGameData.current.CurrentGame.id}};

    if (socket.current && socketIsConnected) {
      socket.current.send(JSON.stringify(data));
    }
  }

  if (socketIsConnected && shouldReconnect) {
    setShouldReconnect(false);
    console.log("sending reconnection request");
    setTimeout(() => {
      send({
        method: "reconnected",
        arguments: {}
      });
    }, 1000);
  }

  if (socketIsConnected && shouldReSync) {
    console.log("resyncing");
    setShouldReSync(false);
    setTimeout(() => {
      send({
        method: "syncState",
        arguments: {}
      });
    }, 1000);
  }

  const createLocalGame = (players: LocalPlayer[]) => {
    currentGameData.current.CurrentGame.id.socketId = players[0].id;

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
    let canExchange = false;

    (async () => {
      const response = await fetch("/gameState/canExchange", {
        method: 'post',
        body: JSON.stringify(currentGameData.current.CurrentGame.id),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(async x => await x.json() as { canExchange: boolean });
      canExchange = response.canExchange;
    })();

    if (canExchange) {
      removePlayerLetters(args.letters);
      endTurn();
    }
  };

  const leaveGame = () => {
    send({
      method: "leaveGame",
      arguments: {}
    });
  };

  const socketOperations: SocketOperations = {
    initOperations: {
      createLocalGame
    },
    gameOperations: {
      placeLetter,
      removeBoardLetter,
      endTurn,
      exchangeLetters,
      leaveGame
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
    } else if (loadingState !== "creatingLocalGame" && grid && Object.keys(grid).length > 0 && currentGameData.current.CurrentGame) {
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

      if (shouldReconnect && !socketIsConnected) {
        setGame(<p>Reconnecting...</p>)
      }
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
