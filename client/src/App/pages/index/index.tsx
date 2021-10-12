import React, {MutableRefObject, useReducer, useRef, useState} from 'react';
import MainSection from 'Components/mainSection';
import RightSection from 'Components/rightSection';
import SocketOperations from 'Pages/index/socketOperations';
import LocalStateChangeEmitter from 'Pages/index/localStateChangeEmitter';
import {LocalState} from 'Pages/index/localState';
import styled from 'styled-components';
import {
  EndTurnResponseArgs,
  GameCreatedResponseArgs,
  GridStateUpdatedResponseArgs,
  LobbyDataUpdatedResponseArgs,
  LobbyStatusResponseArgs,
  OnlineLobbyJoinedResponseArgs,
  PlayerLeftResponseArgs,
  ReconnectedAckResponseArgs,
  SyncGameStateResponseArgs,
  PlayerUpdatedResponseArgs,
  PlayersUpdatedResponseArgs
} from 'Types/responseArgs';
import {IWebsocketResponseMethod, WebsocketResponseMethods} from 'Types/sharedTypes';

const Container = styled.section`
  flex: 7;
  display: flex;
  align-items: stretch;
  justify-content: space-evenly;
  height: 100%;
  color: #4E4D5C;
  min-height: 500px;
  min-width: 860px;
  margin-bottom: 0.5rem;
`;

export default function Index(): JSX.Element {
  const [shouldInitSocket, setShouldInitSocket] = useState(true);
  const shouldReconnect = useRef(false);
  const [shouldReSync, setShouldReSync] = useState(false);
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  const localState = useRef(new LocalState());

  const socket: MutableRefObject<WebSocket | undefined> = useRef();

  const localStateChangeEmitter = useRef(new LocalStateChangeEmitter(
    setShouldReSync,
    socket,
    localState
  ));

  const socketOperations = useRef(new SocketOperations(localState, socket));

  const handleMethod = function <T>(targetMethod: WebsocketResponseMethods, websocketMethod: IWebsocketResponseMethod<T>, cb: (a: T) => void) {
    if (websocketMethod.method === targetMethod && websocketMethod.arguments.data) {
      cb(websocketMethod.arguments.data);
    }
  };

  if (shouldInitSocket) {
    socket.current = new WebSocket('ws://localhost:8080/ws');
    socket.current.onopen = () => {
      console.log('Connected to socket');

      localStateChangeEmitter.current.loadingStateUpdated.emit('update', 'notLoading');
      socket.current!.onmessage = (message) => {
        if (typeof message.data === 'string') {

          const websocketMethod = JSON.parse(message.data) as IWebsocketResponseMethod<any>;

          if (websocketMethod?.arguments?.error) {
            console.error(websocketMethod.arguments.error.message);
            return;
          }

          handleMethod('localGameCreated', websocketMethod as IWebsocketResponseMethod<GameCreatedResponseArgs>, localStateChangeEmitter.current.onLocalGameCreated.bind(localStateChangeEmitter.current));
          handleMethod<OnlineLobbyJoinedResponseArgs>('onlineLobbyJoined', websocketMethod, localStateChangeEmitter.current.onOnlineLobbyJoined.bind(localStateChangeEmitter.current));
          handleMethod<GridStateUpdatedResponseArgs>('gridStateUpdated', websocketMethod, localStateChangeEmitter.current.onGridStateUpdated.bind(localStateChangeEmitter.current));
          handleMethod<PlayerUpdatedResponseArgs>('playerUpdated', websocketMethod, localStateChangeEmitter.current.onPlayerUpdated.bind(localStateChangeEmitter.current));
          handleMethod<PlayersUpdatedResponseArgs>('playersUpdated', websocketMethod, localStateChangeEmitter.current.onPlayersUpdated.bind(localStateChangeEmitter.current));
          handleMethod<EndTurnResponseArgs>('endTurn', websocketMethod, localStateChangeEmitter.current.onEndTurn.bind(localStateChangeEmitter.current));
          handleMethod('gameCanEnd', websocketMethod, localStateChangeEmitter.current.onGameCanEnd.bind(localStateChangeEmitter.current));
          handleMethod('gameEnded', websocketMethod, localStateChangeEmitter.current.onGameEnded.bind(localStateChangeEmitter.current));
          handleMethod<ReconnectedAckResponseArgs>('reconnectedAck', websocketMethod, localStateChangeEmitter.current.onReconnectedAck.bind(localStateChangeEmitter.current));
          handleMethod<SyncGameStateResponseArgs>('syncGameState', websocketMethod, localStateChangeEmitter.current.onSyncGameState.bind(localStateChangeEmitter.current));
          handleMethod<PlayerLeftResponseArgs>('playerLeft', websocketMethod, localStateChangeEmitter.current.onPlayerLeft.bind(localStateChangeEmitter.current));
          handleMethod<LobbyStatusResponseArgs>('lobbyStatus', websocketMethod, localStateChangeEmitter.current.onLobbyStatus.bind(localStateChangeEmitter.current));
          handleMethod<LobbyDataUpdatedResponseArgs>('lobbyDataUpdated', websocketMethod, localStateChangeEmitter.current.onLobbyDataUpdated.bind(localStateChangeEmitter.current));
          handleMethod<LobbyDataUpdatedResponseArgs>('syncLobbyState', websocketMethod, localStateChangeEmitter.current.onSyncLobbyState.bind(localStateChangeEmitter.current));
          handleMethod('kicked', websocketMethod, localStateChangeEmitter.current.onKicked.bind(localStateChangeEmitter.current));
          handleMethod<GameCreatedResponseArgs>('onlineGameCreated', websocketMethod, localStateChangeEmitter.current.onOnlineGameCreated.bind(localStateChangeEmitter.current));
        }
      };

      if (shouldReconnect.current) {
        forceUpdate();
      }
    };

    socket.current.onclose = () => {
      localStateChangeEmitter.current.socketIsConnectedUpdated.emit('update', false);
      shouldReconnect.current = true;
      localStateChangeEmitter.current.shouldReconnectUpdated.emit('update', true);
      setShouldInitSocket(true);
    };
    socket.current.onerror = (err) => {
      console.log('Error', err);
    };

    setShouldInitSocket(false);
  }

  if (socket.current?.readyState === WebSocket.OPEN && shouldReconnect.current) {
    shouldReconnect.current = false;
    localStateChangeEmitter.current.shouldReconnectUpdated.emit('update', false);

    if (socketOperations.current) {
      const args = {roomId: ''};

      if (localState.current.lobbyData.lobbyId.trim() !== '') {
        args.roomId = localState.current.lobbyData.lobbyId;
      } else {
        args.roomId = localState.current.id.roomId;
      }

      setTimeout(() => {
        socketOperations.current.send({
          method: 'reconnected',
          arguments: args
        });
      }, 1000);
    }
  }

  if (socket.current?.readyState === WebSocket.OPEN && shouldReSync) {
    setShouldReSync(false);

    if (socketOperations.current) {
      if (localState.current.lobbyData.lobbyId.trim() !== '') {
        setTimeout(() => {
          socketOperations.current.send({
            method: 'syncLobbyState',
            arguments: {}
          });
        }, 1000);
      } else {
        setTimeout(() => {
          socketOperations.current.syncGameState();
        }, 1000);
      }
    }

  }

  return (
    <Container>
      <MainSection socketOperations={socketOperations} localStateChangeEmitter={localStateChangeEmitter}/>
      <RightSection socketOperations={socketOperations} localStateChangeEmitter={localStateChangeEmitter}/>
    </Container>
  );
}
