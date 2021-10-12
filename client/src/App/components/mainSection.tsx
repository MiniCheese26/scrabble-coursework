import {Route, Switch, useLocation} from 'react-router-dom';
import UiNavigation from 'Components/uiNavigation';
import React from 'react';
import Game from 'Pages/game/game';
import {BothSocketProps} from 'Types/props';
import styled from 'styled-components';
import {Panel} from 'Styles/layout/panel';

const MainSectionStyle = styled(Panel)`
  flex: 4 1 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0.5rem;
  max-width: 75%;

  & a:not(:last-child) {
    margin-bottom: 1rem;
  }
  
  @media (min-width: 992px) {
    max-width: 80%;
  }
`;

export default function MainSection(props: BothSocketProps) {
  const location = useLocation();

  return (
    <MainSectionStyle>
      <Switch location={location}>
        <Route exact path='/game'>
          <Game socketOperations={props.socketOperations} localStateChangeEmitter={props.localStateChangeEmitter}/>
        </Route>
        <Route>
          <UiNavigation socketOperations={props.socketOperations} localStateChangeEmitter={props.localStateChangeEmitter}/>
        </Route>
      </Switch>
    </MainSectionStyle>
  );
}
