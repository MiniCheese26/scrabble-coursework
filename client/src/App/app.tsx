import {Root} from "Styles/root/styles"
import GlobalStyles from "Styles/globalDefault";
import GlobalFonts from "./fonts/fonts";
import Navbar from "./layout/navbar/navbar";
import Footer from "./layout/footer/footer";
import React from "react";
import Index from "Pages/index";
import {Route, Switch, useLocation} from "react-router-dom";
import Preview from "Components/preview";

export default function App(): JSX.Element {
    // required with webpack for whatever reason, lost 3 hours of my life because of this
    const location = useLocation();

    return (
        <Root>
            <GlobalStyles/>
            <GlobalFonts/>
            <Navbar/>
            <Switch location={location}>
                <Route path="/" component={Index}/>
            </Switch>
            <Footer/>
            <Preview/>
        </Root>
    );
}