import React, {MutableRefObject, useRef, useState} from 'react';
import {Route, Switch, useLocation} from "react-router-dom";
import Game from "Pages/game/game";
import {MainSection, Container, RightSection} from "Styles/index/styles";
import {LeftSection, ProfileDetails, ProfileHeader, ProfileName, ProfilePicture} from "Styles/index/profiles/styles";
import UiNavigation from "Components/uiNavigation";
import Letters from "Components/letters";
import Empty from "Components/empty";
import {io, Socket} from "socket.io-client"
import {ExchangeLettersArgs, Letter, LocalPlayer, PlaceLetterArgs, RemoveBoardLetterArgs} from "Types/sharedTypes";
import {CurrentGame, IndexStates, SocketOperations} from "Types/index";
import GameLoading from "Components/gameLoading";
import CurrentPlayer from "Components/currentPlayer";
import EndTurn from "Components/endTurn";
import Score from "Components/score";

export default function Index(): JSX.Element {
  console.log("------------------------");
  const location = useLocation();

  const [shouldInitSocket, setShouldInitSocket] = useState(true);
  const [grid, setGrid] = useState<any>({});
  const [loadingState, setLoadingState] = useState<IndexStates>("notLoading");
  const [activeErrors, setActiveErrors] = useState<any[]>([]);

  // Used because updating the refs below will not cause the component to re-render.
  // Plus, updating the states of the JSX components (game, letters, currentPlayerComponent etc.)
  // without this update check causes the component to re-render infinitely since the conditions
  // for updating pass, then it re-renders and then the conditions pass again, it re-renders again and so on.
  const [updateComponentData, setUpdateComponentData] = useState(false);

  // These have to be created by useRef because they're referenced in callback closures
  // and because of how react hooks work references to a state will become stale
  const players: MutableRefObject<any[]> = useRef([]);
  const currentGame: MutableRefObject<CurrentGame> = useRef({
    active: false,
    type: "",
    id: {
      gameId: "",
      socketId: ""
    },
    currentPlayer: ""
  });
  const socket: MutableRefObject<Socket> = useRef(
    io({
      autoConnect: false
    }));

  if (shouldInitSocket) {
    socket.current.open();

    socket.current.on("connect", () => {
      console.log("Connected to socket");
    });

    socket.current.on("disconnected", () => {
      console.error("Lost connection to socket");
    });

    socket.current.on("debugMessage", (args: any) => {
      console.debug(args);
    });

    socket.current.on("localGameCreated", (grid: string, gameId: string, playerData: string, currentPlayer: string) => {
      const gridParsed = JSON.parse(grid);
      const playersParsed = JSON.parse(playerData);
      setGrid(gridParsed);

      currentGame.current = {
        active: true,
        currentPlayer,
        id: {gameId, socketId: playersParsed[0].playerId},
        type: "local"
      };

      players.current = playersParsed;
      setLoadingState("notLoading");
      setUpdateComponentData(true);
    });

    socket.current.on("gridStateUpdated", (grid: string) => {
      const gridParsed = JSON.parse(grid);
      setGrid(gridParsed);
      setUpdateComponentData(true);
    });

    socket.current.on("updatePlayer", (data: any) => {
      const parsedData = JSON.parse(data);

      if (currentGame.current.type === "local") {
        const latestPlayersClone = [...players.current];
        const y = latestPlayersClone.find(x => x.playerId === parsedData.playerId);
        const w = latestPlayersClone.indexOf(y);
        latestPlayersClone[w] = parsedData;
        players.current = latestPlayersClone;
      } else if (currentGame.current.type === "online") {
        players.current = parsedData;
      }

      setUpdateComponentData(true);
    });

    socket.current.on("updatePlayers", (data: any) => {
      const parsedData = JSON.parse(data);

      console.log(parsedData);

      for (const d of parsedData) {
        const latestPlayersClone = [...players.current];
        const y = latestPlayersClone.find(x => x.playerId === d.playerId);
        const w = latestPlayersClone.indexOf(y);
        latestPlayersClone[w] = d;
        players.current = latestPlayersClone;
      }

      setUpdateComponentData(true);
    });

    socket.current.on("endTurn", (currentPlayer: string, errors: string) => {
      currentGame.current.id.socketId = currentPlayer;
      currentGame.current.currentPlayer = currentPlayer;

      const errorsParsed = JSON.parse(errors);
      setActiveErrors(errorsParsed);

      setUpdateComponentData(true);
    });

    setShouldInitSocket(false);
  }

  const createLocalGame = (players: LocalPlayer[]) => {
    socket.current.emit("createLocalGame", players);
  };

  const placeLetter = (args: PlaceLetterArgs) => {
    socket.current.emit("placeLetter", currentGame.current.id, args);
  };

  const removeBoardLetter = (args: RemoveBoardLetterArgs) => {
    socket.current.emit("removeBoardLetter", currentGame.current.id, args);
  };

  const removePlayerLetters = (letters: Letter[]) => {
    socket.current.emit("removePlayerLetters", currentGame.current.id, letters);
  };

  const endTurn = () => {
    socket.current.emit("endTurn", currentGame.current.id, currentGame.current.type);
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
  const [currentPlayerComponent, setCurrentPlayerComponent] = useState<JSX.Element | null>(null);
  const [score, setScore] = useState(<Score score={0}/>);

  if (updateComponentData) {
    if (loadingState !== "creatingLocalGame" && grid && Object.keys(grid).length > 0 && currentGame.current) {
      setGame(<Game grid={grid} players={players.current} currentGame={currentGame.current}
                    socketOperations={socketOperations.gameOperations}/>);
    }

    if (loadingState !== "creatingLocalGame" && players && players.current.length !== 0 && currentGame.current) {
      const currentPlayer = players.current.find(x => x.playerId === currentGame.current.currentPlayer);

      setScore(<Score score={currentPlayer.score}/>);
      setCurrentPlayerComponent(<CurrentPlayer currentPlayer={currentPlayer.name}/>);
      setLetters(<Letters letters={currentPlayer.letters} gameOperations={socketOperations.gameOperations}/>);
    }

    setUpdateComponentData(false);
  }

  return (
    <Container>
      <LeftSection>
        <ProfileHeader>
          <ProfilePicture/>
          <ProfileName>Guest</ProfileName>
        </ProfileHeader>
        <ProfileDetails>
        </ProfileDetails>
      </LeftSection>
      <MainSection>
        <Switch location={location}>
          <Route exact path="/game">
            {game}
          </Route>
          <Route>
            <UiNavigation socketOperations={socketOperations}/>
          </Route>
        </Switch>
      </MainSection>
      <RightSection>
        <Switch location={location}>
          <Route exact path="/game">
            {currentPlayerComponent}
            {letters}
            <p>score: {score}</p>
            {activeErrors.map(x => <p>{x}</p>)}
            <EndTurn gameOperations={socketOperations.gameOperations}/>
          </Route>
          <Route component={Empty}/>
        </Switch>
      </RightSection>
    </Container>
  );
}
