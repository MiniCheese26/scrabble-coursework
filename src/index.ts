import 'module-alias/register.js';
import express from 'express';
import compression from 'compression';
import http from 'http';
import {Server} from 'ws';
import indexRouter from './routes/home/home';
import {gameStateRouter, initialiseSocket} from '@Websocket/sockets';

const app = express();
const httpServer = http.createServer(app);
const ws = new Server({
  server: httpServer,
  path: '/ws'
});

const PORT = 8080;

app.use(express.static('./client/build'));
app.use(compression());
app.use(express.json());

// Sourced from https://stackoverflow.com/questions/29511404/connect-to-socket-io-server-with-specific-path-and-namespace
const unless = (middleware: any, ...paths: string[]) => {
  return (req: any, res: any, next: any) => {
    if (paths.some(x => req.path.match(`^\\/${x}\\/?.*$`))) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

app.use(unless(indexRouter, 'ws', 'gameState'));
app.use('/gameState', gameStateRouter);

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

initialiseSocket(ws);
