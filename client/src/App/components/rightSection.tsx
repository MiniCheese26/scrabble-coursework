import {Route, Switch, useLocation} from 'react-router-dom';
import EndTurn from 'Components/endTurn';
import Empty from 'Components/empty';
import React from 'react';
import WordCheck from 'Components/wordCheck';
import Letters from 'Components/letters';
import CurrentPlayer from 'Components/currentPlayer';
import Scores from 'Components/scores';
import Errors from 'Components/errors';
import {BothSocketProps} from 'Types/props';
import styled from 'styled-components';
import {Panel} from 'Styles/layout/panel';

const RightSectionStyle = styled(Panel)`
  flex: 1 2 20%;
  display: flex;
  flex-direction: column;
  margin-right: 0.5rem;
`;

export default function RightSection(props: BothSocketProps) {
  const location = useLocation();

  return (
    <RightSectionStyle>
      <Switch location={location}>
        <Route exact path='/game'>
          <CurrentPlayer localStateChangeEmitter={props.localStateChangeEmitter}/>
          <Letters socketOperations={props.socketOperations} localStateChangeEmitter={props.localStateChangeEmitter}/>
          <WordCheck/>
          <Scores localStateChangeEmitter={props.localStateChangeEmitter}/>
          <Errors localStateChangeEmitter={props.localStateChangeEmitter}/>
          <EndTurn socketOperations={props.socketOperations}/>
        </Route>
        <Route component={Empty}/>
      </Switch>
    </RightSectionStyle>
  );
}
