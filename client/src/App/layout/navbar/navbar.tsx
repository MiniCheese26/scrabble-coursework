import React from 'react';
import { Link } from 'react-router-dom';
import {Header, HeaderTitle} from "Styles/navbar/styles";

export default function Navbar(): JSX.Element {
    return (
        <Header>
            <HeaderTitle>
                <Link to="/">Scrabble 3</Link>
                <h4>So good we had to skip 2</h4>
            </HeaderTitle>
        </Header>
    );
}
