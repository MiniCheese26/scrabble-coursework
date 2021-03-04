import React from 'react';
import { Link } from 'react-router-dom';
import {Header, HeaderCreditsOuter, HeaderMenuOuter, HeaderTitle} from "Styles/navbar/styles";

export default function Navbar(): JSX.Element {
    return (
        <Header>
            <HeaderMenuOuter>
                <h1>menu</h1>
            </HeaderMenuOuter>
            <HeaderTitle>
                <Link to="/">Scrabble 3</Link>
                <h4>So good we had to skip 2</h4>
            </HeaderTitle>
            <HeaderCreditsOuter>
                <h1>credits</h1>
            </HeaderCreditsOuter>
        </Header>
    );
}
