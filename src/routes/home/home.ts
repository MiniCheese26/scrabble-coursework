import * as express from "express";
import {join} from 'path';
import * as pkgDir from "pkg-dir";

const indexRouter = express.Router();
export default indexRouter;
import {generateCspNonce, addCspNonce} from "../csp-nonce";

indexRouter.get("/*", async (req, res) => {
    console.log("Index");
    const cspNonce = generateCspNonce();
    addCspNonce(cspNonce, res);
    res.sendFile(join(await pkgDir(__dirname)+ "/client/build/index.html"));
})