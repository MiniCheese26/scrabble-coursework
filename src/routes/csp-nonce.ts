import * as crypto from "crypto";
import * as express from "express"

export function generateCspNonce() {
    return crypto.randomBytes(16).toString("base64");
}

export function addCspNonce(cspNonce: string, response: express.Response) {
    let updatedCspHeader = response.getHeader("Content-Security-Policy");

    if (updatedCspHeader) {
        if (typeof updatedCspHeader === "string") {
            updatedCspHeader = updatedCspHeader.replace(/{nonce}/gm, cspNonce);
        }

        response.setHeader("Content-Security-Policy", updatedCspHeader);
    }
}