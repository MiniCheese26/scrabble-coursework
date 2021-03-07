import {Route, Switch, useLocation} from "react-router-dom";
import {MainSection as MainSectionStyles} from "Styles/index/styles";
import UiNavigation from "Components/uiNavigation";
import React from "react";
import {InitOperations} from "Types/index";

export type MainSectionProps = {
  game: React.ReactElement,
  initOperations: InitOperations
};

export default function MainSection(props: MainSectionProps) {
  const location = useLocation();

  return (
    <MainSectionStyles>
      <Switch location={location}>
        <Route exact path="/game">
          {props.game}
        </Route>
        <Route>
          <UiNavigation initOperations={props.initOperations}/>
        </Route>
      </Switch>
    </MainSectionStyles>
  );
}