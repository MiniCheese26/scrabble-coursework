import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/app';
import {BrowserRouter as Router} from 'react-router-dom';
import {DndProvider} from 'react-dnd';
import {TouchBackend} from 'react-dnd-touch-backend';

ReactDOM.render(
  <Router basename={window.location.hostname === 'localhost' ? '/' : '/scrabble'}>
    <DndProvider backend={TouchBackend} options={{enableMouseEvents: true}}>
      <App/>
    </DndProvider>
  </Router>,
  document.getElementById('root')
);
