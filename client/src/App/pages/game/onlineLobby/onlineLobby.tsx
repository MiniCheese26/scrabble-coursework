import React, {useRef} from 'react';
import {LobbyData, SocketIdentification} from 'Types/sharedTypes';
import OnlinePlayer from 'Components/onlinePlayer';
import {Redirect, useHistory, useLocation} from 'react-router-dom';
import useWebsocketEvent from 'Hooks/useWebsocketEvent';
import {BothSocketProps} from 'Types/props';
import {InfoBoxName, InfoBoxText, InfoBoxWrapper} from 'Styles/layout/infoBox';
import {OnlineLobbyBox, StartGame} from 'Styles/layout/lobby';
import {PlayerWrapper} from 'Styles/layout/lobbyCard';

export default function OnlineLobby(props: BothSocketProps) {
  const PATH = '/onlineLobby';
  const DESTINATION_PATH = '/game';
  const location = useLocation<{ lobbyData: LobbyData, id: SocketIdentification, password?: string, isHost: boolean } | undefined>();
  const history = useHistory();

  const lobbyData = useWebsocketEvent<LobbyData>(props.localStateChangeEmitter.current.lobbyDataUpdated, location?.state?.lobbyData);
  const id = useWebsocketEvent<SocketIdentification>(props.localStateChangeEmitter.current.idUpdated, location?.state?.id);
  const kicked = useWebsocketEvent<boolean>(props.localStateChangeEmitter.current.kicked, false);
  const gameStarted = useWebsocketEvent<boolean>(props.localStateChangeEmitter.current.onlineGameStarted, false);

  const requestSent = useRef(false);

  if (location.state === undefined) {
    return (<></>);
  }

  if (kicked === true) {
    return (<Redirect to={{pathname: '/'}}/>);
  }

  history.listen((location) => {
    if (location.pathname !== PATH && location.pathname !== DESTINATION_PATH) {
      const player = lobbyData!.players.find(x => x.id === id?.playerId);
      if (!requestSent.current) {
        props.socketOperations.current.leaveLobby({
          player: player!,
        });
        requestSent.current = true;
      }
    }
  });

  const onStartGame = () => {
    props.socketOperations.current.createOnlineGame();
    history.push('/game', {isHost: true});
  };

  if (gameStarted === true) {
    return (<Redirect to={{pathname: '/game', state: {isHost: false}}}/>);
  }

  return (
    <OnlineLobbyBox>
      <InfoBoxWrapper title={'click to copy'} gridArea={'id'}
                      onClick={() => navigator.clipboard.writeText(lobbyData!.lobbyId)}>
        <InfoBoxName>ID</InfoBoxName>
        <InfoBoxText>{lobbyData!.lobbyId}</InfoBoxText>
      </InfoBoxWrapper>
      {location?.state.password && location?.state.isHost ? (
        <InfoBoxWrapper title={'click to copy'} gridArea={'password'}
                        onClick={() => navigator.clipboard.writeText(location?.state?.password ?? '')}>
          <InfoBoxName>Pass</InfoBoxName>
          <InfoBoxText>{location?.state.password}</InfoBoxText>
        </InfoBoxWrapper>
      ) : null}
      <PlayerWrapper gridArea={'player1'}>
        <OnlinePlayer player={lobbyData!.players[0]} isHost={location?.state.isHost}
                      socketOperations={props.socketOperations}
                      lobbyId={lobbyData!.lobbyId} id={id}/>
      </PlayerWrapper>
      <PlayerWrapper gridArea={'player2'}>
        <OnlinePlayer player={lobbyData!.players[1]} isHost={location?.state.isHost}
                      socketOperations={props.socketOperations}
                      lobbyId={lobbyData!.lobbyId} id={id}/>
      </PlayerWrapper>
      <PlayerWrapper gridArea={'player3'}>
        <OnlinePlayer player={lobbyData!.players[2]} isHost={location?.state.isHost}
                      socketOperations={props.socketOperations}
                      lobbyId={lobbyData!.lobbyId} id={id}/>
      </PlayerWrapper>
      <PlayerWrapper gridArea={'player4'}>
        <OnlinePlayer player={lobbyData!.players[3]} isHost={location?.state.isHost}
                      socketOperations={props.socketOperations}
                      lobbyId={lobbyData!.lobbyId} id={id}/>
      </PlayerWrapper>
      {location?.state.isHost ? (<StartGame onClick={() => onStartGame()}>Start Game</StartGame>) : null}
    </OnlineLobbyBox>
  );
}
