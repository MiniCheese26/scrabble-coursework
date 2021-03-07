import React, {MutableRefObject, useRef, useState} from 'react';
import Game from "Pages/game/game";
import {Container} from "Styles/index/styles";
import Letters from "Components/letters";
import {io, Socket} from "socket.io-client"
import {
  ExchangeLettersArgs, GameGridElement, GameGridItem,
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
import LeftSection from "Components/leftSection";
import MainSection from "Components/mainSection";
import RightSection from "Components/rightSection";

export default function Index(): JSX.Element {
  console.log("------------------------");

  const [shouldInitSocket, setShouldInitSocket] = useState(true);
  const [grid, setGrid] = useState<GameGridElement<GameGridItem>[]>([]);
  const [loadingState, setLoadingState] = useState<IndexStates>("notLoading");
  const [activeErrors, setActiveErrors] = useState<string[]>([]);

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

  const socket: MutableRefObject<Socket> = useRef(
    io({
      autoConnect: false
    }));

  const updatePlayer = (parsedData: SharedPlayer) => {
    const targetPlayerIndex = currentGameData.current.Players.findIndex(x => x.playerId === parsedData.playerId);

    if (targetPlayerIndex !== -1) {
      currentGameData.current.Players[targetPlayerIndex] = parsedData;
    }
  }

  if (shouldInitSocket) {
    socket.current.open();

    socket.current.on("connect", () => {
      console.log("Connected to socket");
    });

    socket.current.on("disconnected", () => {
      console.error("Lost connection to socket");
    });

    socket.current.on("debugMessage", (args: string) => {
      console.debug(args);
    });

    socket.current.on("localGameCreated", (grid: string, gameId: string, playerData: string) => {
      const gridParsed: GameGridElement<GameGridItem>[] = JSON.parse(grid);
      const playersParsed: SharedPlayer[] = JSON.parse(playerData);
      setGrid(gridParsed);

      currentGameData.current.CurrentGame = {
        active: true,
        id: {gameId, socketId: playersParsed[0].playerId},
        type: "local"
      };

      currentGameData.current.Players = playersParsed;
      setLoadingState("notLoading");
      setUpdateComponentData(true);
    });

    socket.current.on("gridStateUpdated", (grid: string) => {
      const gridParsed: GameGridElement<GameGridItem>[] = JSON.parse(grid);
      setGrid(gridParsed);
      setUpdateComponentData(true);
    });

    socket.current.on("updatePlayer", (data: string) => {
      const parsedData: SharedPlayer = JSON.parse(data);

      updatePlayer(parsedData);

      setUpdateComponentData(true);
    });

    socket.current.on("updatePlayers", (data: string) => {
      const parsedData: SharedPlayer[] = JSON.parse(data);

      console.log(parsedData);

      for (const player of parsedData) {
        updatePlayer(player);
      }

      setUpdateComponentData(true);
    });

    socket.current.on("endTurn", (currentPlayer: string, errors: string) => {
      currentGameData.current.CurrentGame.id.socketId = currentPlayer;

      const errorsParsed: string[] = JSON.parse(errors);
      setActiveErrors(errorsParsed);

      setUpdateComponentData(true);
    });

    setShouldInitSocket(false);
  }

  const createLocalGame = (players: LocalPlayer[]) => {
    socket.current.emit("createLocalGame", players);
  };

  const placeLetter = (args: PlaceLetterArgs) => {
    socket.current.emit("placeLetter", currentGameData.current.CurrentGame.id, args);
  };

  const removeBoardLetter = (args: RemoveBoardLetterArgs) => {
    socket.current.emit("removeBoardLetter", currentGameData.current.CurrentGame.id, args);
  };

  const removePlayerLetters = (letters: Letter[]) => {
    socket.current.emit("removePlayerLetters", currentGameData.current.CurrentGame.id, letters);
  };

  const endTurn = () => {
    socket.current.emit("endTurn", currentGameData.current.CurrentGame.id, currentGameData.current.CurrentGame.type);
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

  if (updateComponentData) {
    if (loadingState !== "creatingLocalGame" && grid && Object.keys(grid).length > 0 && currentGameData.current.CurrentGame) {
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
    }

    setUpdateComponentData(false);
  }

  return (
    <Container>
      <LeftSection/>
      <MainSection game={game} initOperations={socketOperations.initOperations}/>
      <RightSection activeErrors={activeErrors} letters={letters} gameOperations={socketOperations.gameOperations}
                    scores={score} currentPlayer={currentPlayerComponent}/>
    </Container>
  );
}
