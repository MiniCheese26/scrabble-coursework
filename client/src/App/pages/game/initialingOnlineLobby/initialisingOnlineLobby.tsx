import {Redirect, useLocation} from 'react-router-dom';
import React, {useRef} from 'react';
import {useWebsocketEventRef} from 'Hooks/useWebsocketEvent';
import {LobbyData, SocketIdentification} from 'Types/sharedTypes';
import {JoinResult} from 'Types/types';
import {BothSocketProps} from 'Types/props';
import {TextBox, TextBoxHeader} from 'Styles/layout/textBox';

export function InitialisingOnlineLobby(props: BothSocketProps) {
  const location = useLocation<boolean | { lobbyId: string, password?: string }>();

  const requestMade = useRef(false);
  const joinResult = useWebsocketEventRef<JoinResult>(props.localStateChangeEmitter.current.lobbyJoined);
  const lobbyData = useWebsocketEventRef<LobbyData>(props.localStateChangeEmitter.current.lobbyDataUpdated);
  const id = useWebsocketEventRef<SocketIdentification>(props.localStateChangeEmitter.current.idUpdated);

  if (!joinResult.current && !requestMade.current) {
    if (typeof location.state === 'boolean') {
      props.socketOperations.current.createOnlineLobby({addPassword: location.state});
    } else {
      props.socketOperations.current.joinOnlineLobby({
        password: location.state.password,
        lobbyId: location.state.lobbyId
      });
    }

    requestMade.current = true;
    return (<p>Joining lobby...</p>);
  } else if (joinResult.current && requestMade.current && !joinResult.current?.result) {
    return (<TextBox>
      <TextBoxHeader>Failed to join</TextBoxHeader>
    </TextBox>);
  } else if (!lobbyData.current) {
    return (<p>Joining lobby...</p>);
  }

  return (<Redirect to={{
    pathname: '/onlineLobby',
    state: {
      lobbyData: lobbyData.current,
      id: id.current,
      password: joinResult.current?.inviteCode,
      isHost: joinResult.current?.isHost
    }
  }}/>);
}
