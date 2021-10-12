import GlobalStyles from 'Styles/globalDefault';
import GlobalFonts from './resources/fonts/fonts';
import Header from './layout/header/header';
import React from 'react';
import Index from 'Pages/index';
import {Route, Switch, useLocation} from 'react-router-dom';
import Preview from 'Components/preview';
import {nanoid} from 'nanoid';
import styled from 'styled-components';

// Credit: https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toTitleCase = function () {
  return this.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Montserrat', sans-serif;
`;

export default function App(): JSX.Element {
    // required with webpack for whatever reason, lost 3 hours of my life because of this
    const location = useLocation();

    if (!sessionStorage.getItem('socketId')) {
      const socketId = nanoid(8);

      sessionStorage.setItem('socketId', socketId);
    }

    return (
        <Root>
            <GlobalStyles/>
            <GlobalFonts/>
            <Header/>
            <Switch location={location}>
                <Route path='/' component={Index}/>
            </Switch>
            <Preview/>
        </Root>
    );
}
