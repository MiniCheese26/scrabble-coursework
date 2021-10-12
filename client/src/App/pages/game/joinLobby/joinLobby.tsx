import {useRef, useState} from 'react';
import React from 'react';
import {TextBox, TextBoxContent, TextBoxHeader} from 'Styles/layout/textBox';
import {Redirect, useHistory} from 'react-router-dom';
import useWebsocketEvent from 'Hooks/useWebsocketEvent';
import {BothSocketProps} from 'Types/props';
import { SubmitButtonLink } from 'Styles/layout/submitButton';
import { InputOption } from 'Styles/layout/inputOption';
import {LobbyStatus} from 'Types/sharedTypes';

export default function JoinLobby(props: BothSocketProps) {
  const history = useHistory<string | null>();
  const [password, setPassword] = useState('');
  const redirected = useRef(false);
  const lobbyStatus = useWebsocketEvent<LobbyStatus>(props.localStateChangeEmitter.current.lobbyStatusReceived);
  const requestMade = useRef(false);

  if (!lobbyStatus) {
    if (!requestMade.current) {
      props.socketOperations.current.checkLobby({
        lobbyId: history.location.state ?? ''
      });

      requestMade.current = true;
    }

    return (<p>Joining lobby...</p>);
  } else {
    if (lobbyStatus.canJoin && !lobbyStatus.requiresPassword && !redirected.current) {

      // needed to stop the component from infinitely re-rendering for some reason
      // might be because it's not unmounted until the transition is up?
      // requires password doesn't trigger the same issue probably because
      // that returns a Link that requires the button press for a redirect
      // whereas redirect just fires on return
      redirected.current = true;
      return (<Redirect to={{
        pathname: '/initialingOnlineLobby',
        state: {lobbyId: history.location.state ?? '', password: ''}
      }}/>);
    } else if (lobbyStatus.requiresPassword) {
      return (
        <>
          <InputOption onChange={(e) => setPassword(e.target.value)} placeholder={'PASSWORD'}
                       maxLength={6}/>
          <SubmitButtonLink to={{
            pathname: '/initialingOnlineLobby',
            state: {lobbyId: history.location.state ?? '', password}
          }}>Submit</SubmitButtonLink>
        </>
      );
    } else {
      return (
        <TextBox>
          <TextBoxHeader>Failed to join lobby</TextBoxHeader>
          <TextBoxContent>{lobbyStatus.reason}</TextBoxContent>
        </TextBox>
      );
    }
  }
}
