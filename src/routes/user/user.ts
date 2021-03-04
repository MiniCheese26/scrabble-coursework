import * as express from "express";
import * as pg from "pg";
const {Pool} = pg;
import * as bcrypt from "bcrypt";
import * as helpers from "../helpers";
import {SignInBody, SignUpBody} from "../../types/user";

const pool = new Pool({
    user: "kaleb",
    host: "localhost",
    database: "scrabble",
    password: "Mini2070",
    port: 5432
});

const userRouter = express.Router();

function validateSignUpInfo(email, username, password) {
    if (helpers.isEmpty(email) || helpers.isEmpty(username) || helpers.isEmpty(password)) {
        return {
            result: false,
            reason: "Email, username or password supplied cannot be empty"
        };
    }

    if (username.length > 30) {
        return {
            result: false,
            reason: "Username supplied cannot be longer than 30 characters"
        };
    }

    if (email.length > 60) {
        return {
            result: false,
            reason: "Email supplied cannot be longer than 60 characters"
        };
    }

    const password_regex = /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*([^\w\s]|[_]))\S{8,72}$/;

    if (!password_regex.test(password)) {
        return {
            result: false,
            reason: "Password supplied does not meet requirements of 8 or more characters including 1 uppercase character, 1 number and 1 special character"
        };
    }

    const email_regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

    if (!email_regex.test(email)) {
        return {
            result: false,
            reason: "Invalid email address supplied"
        }
    }

    return {
        result: true
    };
}

userRouter.post("/signup", async (req, res) => {
    const {email, password, username}: SignUpBody = req.body;

    if (req.session.username) {
        res.status(200).end();
        return;
    }

    const signUpInfoValidation = validateSignUpInfo(email, username, password);

    if (!signUpInfoValidation.result) {
        res.status(400).json(signUpInfoValidation.reason);
        return;
    }

    let userResult;

    try {
        userResult = await pool.query("SELECT username, email FROM users WHERE username = $1 OR email = $2", [username, email]);
    } catch (_) {
        res.status(500).json({
            reason: "Internal server error"
        });
        return;
    }

    if (userResult.rowCount > 0) {
        res.status(400).json({
            reason: "An account with these details already exists"
        });
        return;
    }

    let passwordHash: string;

    try {
        passwordHash = await bcrypt.hash(password, 10);
    } catch (_) {
        res.status(500).json({
            reason: "Internal server error"
        });
        return;
    }

    try {
        await pool.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3)", [username, passwordHash, email]);
    } catch (_) {
        res.status(500).json({
            reason: "Internal server error"
        });
        return;
    }

    req.session.username = username;
    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 365;

    res.status(200).end();
});

userRouter.post("/login", async (req, res) => {
    const {username, password, remember}: SignInBody = req.body;

    if (req.session.username) {
        res.status(200).end();
        return;
    }

    let userResult;

    try {
        userResult = await pool.query("SELECT password FROM users WHERE username = $1", [username]);
    } catch (_) {
        res.status(500).json({
            reason: "Internal server error"
        });
        return;
    }

    if (userResult.rowCount === 0) {
        res.status(400).json({
            reason: "Supplied account does not exist"
        });
        return;
    }

    const hashedPassword = userResult.rows[0].password;

    let compareResult: boolean;

    try {
        compareResult = await bcrypt.compare(password, hashedPassword);
    } catch (_) {
        res.status(500).json({
            reason: "Internal server error"
        });
    }

    if (!compareResult) {
        res.status(401).json({
            reason: "Incorrect account info"
        });
        return;
    }

    req.session.username = username;

    if (remember) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 365;
    } else {
        req.session.cookie.maxAge = 0;
    }

    res.status(200).end();
});

export default userRouter;