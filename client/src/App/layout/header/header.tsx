import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

const HeaderStyle = styled.header`
  flex: 1;
  display: flex;
  background-color: #DB5461;
  align-items: stretch;
  margin-bottom: 0.5rem;
`;

const HeaderItem = styled.div`
  flex: 1;
`;

const HeaderTitle = styled(HeaderItem)`
  font-weight: 300;
  flex-grow: 6;
  text-align: center;
  
  & a {
    font-size: 5rem;
    text-decoration: none;
    color: black;
  }

  & h4 {
    font-size: 1.8rem;
    padding-bottom: 0.7rem;
  }
`;

export default function Header(): JSX.Element {
  return (
    <HeaderStyle>
      <HeaderTitle>
        <Link to='/' replace>Scrabble 3</Link>
        <h4>So good we had to skip 2</h4>
      </HeaderTitle>
    </HeaderStyle>
  );
}
