import {animated, useTransition} from 'react-spring';
import {Route, Switch, useHistory, useLocation} from 'react-router-dom';
import Choosing from 'Pages/game/choosing/choosing';
import Create from 'Pages/game/create/create';
import Join from 'Pages/game/join/join';
import CreateLocal from 'Pages/game/createLocal/createLocal';
import Game from 'Pages/game/game';
import React, {useState} from 'react';
import OnlineLobby from 'Pages/game/onlineLobby/onlineLobby';
import JoiningGame from 'Pages/game/joinLobby/joinLobby';
import {YesNoPrompt} from 'Components/yesNoPrompt';
import {InitialisingOnlineLobby} from 'Pages/game/initialingOnlineLobby/initialisingOnlineLobby';
import {BothSocketProps} from 'Types/props';
import styled from 'styled-components';
import { BackOption } from 'Styles/layout/back';

const AnimatedDivWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export default function UiNavigation(props: BothSocketProps): JSX.Element {
  const [transition, setTransition] = useState('in');

  const history = useHistory();
  const location = useLocation();

  const transitions = useTransition(location, location => location.pathname, {
    from: {
      opacity: 0,
      transform: `translate(-50%, -50%) translate3d(${transition === 'in' ? '15rem' : '-15rem'}, 0, 0)`,
      display: 'flex',
      left: '50%',
      top: '50%',
      position: 'absolute',
      'alignContent': 'center',
      'flexDirection': 'column',
      'justifyContent': 'center'
    },
    enter: {
      opacity: 1,
      transform: 'translate(-50%, -50%) translate3d(0, 0, 0)'
    },
    leave: {
      opacity: 0,
      transform: `translate(-50%, -50%) translate3d(${transition === 'in' ? '-15rem' : '15rem'}, 0, 0)`
    }
  });

  const handleBackClick = () => {
    setTransition('out');
    history.goBack();
  };

  const handleClick = () => {
    setTransition('in');
  };

  return (
    <>
      <BackOption onClick={handleBackClick}>Back</BackOption>
      <AnimatedDivWrapper>
        {
          transitions.map(({item, props: transition, key}) => (
            <animated.div key={key} style={transition} onClick={handleClick}>
              <Switch location={item}>
                <Route exact path='/' component={Choosing}/>
                <Route exact path='/create' component={Create}/>
                <Route exact path='/join' component={Join}/>
                <Route exact path='/createLocal'>
                  <CreateLocal socketOperations={props.socketOperations}/>
                </Route>
                <Route exact path='/createOnline'>
                  <YesNoPrompt question={'Would you like to add a password?'}
                               onYes={() => history.push('/initialingOnlineLobby', true)}
                               onNo={() => history.push('/initialingOnlineLobby', false)}/>
                </Route>
                <Route exact path='/onlineLobby'>
                  <OnlineLobby socketOperations={props.socketOperations}
                               localStateChangeEmitter={props.localStateChangeEmitter}/>
                </Route>
                <Route exact path='/joiningGame'>
                  <JoiningGame socketOperations={props.socketOperations}
                               localStateChangeEmitter={props.localStateChangeEmitter}/>
                </Route>
                <Route exact path='/initialingOnlineLobby'>
                  <InitialisingOnlineLobby localStateChangeEmitter={props.localStateChangeEmitter} socketOperations={props.socketOperations}/>
                </Route>
                <Route exact path='/game' component={Game}/>
              </Switch>
            </animated.div>
          ))
        }
      </AnimatedDivWrapper>
    </>
  );
}
