import {Route, Switch, useLocation} from "react-router-dom";
import EndTurn from "Components/endTurn";
import Empty from "Components/empty";
import React from "react";
import {RightSection as RightSectionStyle} from "Styles/index/styles";
import {GameOperations} from "Types/index";
import WordCheck from "Components/wordCheck";

export type RightSectionProps = {
  currentPlayer: React.ReactElement,
  letters: React.ReactElement,
  scores: React.ReactElement,
  activeErrors: string[],
  gameOperations: GameOperations
};

export default function RightSection(props: RightSectionProps) {
  const location = useLocation();

  return (
    <RightSectionStyle>
      <Switch location={location}>
        <Route exact path="/game">
          {props.currentPlayer}
          {props.letters}
          <WordCheck/>
          {props.scores}
          {props.activeErrors.map(x => <p>{x}</p>)}
          <EndTurn gameOperations={props.gameOperations}/>
        </Route>
        <Route component={Empty}/>
      </Switch>
    </RightSectionStyle>
  );
}