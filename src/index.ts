import "module-alias/register.js";
import * as express from "express";
import * as compression from "compression";
import * as session from "express-session";
import * as http from "http";
import {Server} from 'socket.io';

//import redis from "redis";
//import connect_redis from "connect-redis";
import * as connect_pg_simple from "connect-pg-simple";
import {Pool} from "pg";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        // Feeling lazy
        origin: '*'
    }
});

/*const RedisStore = connect_redis(session);
const redisClient = redis.createClient({
    password: "GF76u/lNp3ydmKP5ubmssO319q+7WXDofLUdBfc+oIgDrhu4dkt7FCWQG49jF814PCPXVpywUWGu4trW"
});*/
const PostgresSession = connect_pg_simple(session);

const pool = new Pool({
    user: "kaleb",
    host: "localhost",
    database: "scrabble",
    password: "Mini2070",
    port: 5432
});

const PORT = 8080;
const SESSION_SECRET = "3yX4_zeGEhsTKmAZMzTu";
const ENV = "development";

/*app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'", "fonts.gstatic.com", "fonts.googleapis.com"],
            scriptSrc: ["'nonce-{random}'", "'unsafe-inline'", "'strict-dynamic'", "'unsafe-eval'", "https:", "http:"],
            styleSrc: ["'self'", "'nonce-{random}'", "https:", "http:"],
            baseUri: ["'none'"],
            objectSrc: ["'none'"],
            imgSrc: ["'self'", "data:"]
        }
    }
}));*/
app.use(express.static("./client/build"));
app.use(compression());
app.use(express.json());
app.use(session({
    secret: SESSION_SECRET,
    name: "SESSION",
    cookie: {
        httpOnly: true,
        secure: ENV !== "development",
        sameSite: true
    },
    store: new PostgresSession({
        pool: pool
    }),
    resave: false,
    saveUninitialized: false
}));

import indexRouter from "./routes/home/home";
import userRouter from "./routes/user/user";
import initialiseSockets from "./sockets/sockets";

// Sourced from https://stackoverflow.com/questions/29511404/connect-to-socket-io-server-with-specific-path-and-namespace
const unless = (middleware: any, ...paths: string[]) => {
    return (req: any, res: any, next: any) => {
        console.log(paths.includes(req.path));
        if (paths.includes(req.path)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    }
}

app.use(unless(indexRouter, '/socket.io/', 'user'));
app.use("/user", userRouter);

httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

initialiseSockets(io);