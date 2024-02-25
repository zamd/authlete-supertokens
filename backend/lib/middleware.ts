import { Request, Response, NextFunction, RequestHandler } from "express";

import { URLSearchParams } from "url";
import express from "express";
import { AuthleteClient } from "./client";
import { ensureAuthleteContext } from "./integrations/supertokens";


const authlete = new AuthleteClient({
    baseUrl: process.env.BASE_URL!,
    apiKey: process.env.API_KEY!,
    apiSecret: process.env.API_SECRET!
});


export function createAuthorizationHandler(authenticationHandler: RequestHandler) {

    return async function authorizationHandler(req: Request, res: Response, next: NextFunction) {
        const params = new URLSearchParams(req.query as Record<string, string>);
        const queryParams = params.toString();
        const user = req.authlete.user;
        const ticket = params.get("ticket");

        if (!ticket) {
            const response = await authlete.startAuthorization({ parameters: queryParams });
            if (response?.action == "INTERACTION") {
                if (user) {
                    //already authenticated. Skip authentication interaction
                    return res.redirect(`${req.path}?ticket=${response.ticket}`);
                }
                return authenticationHandler(req, res, next);
            }
            return res.status(400).json(response);
        } else if (!user) {
            return authenticationHandler(req, res, next);
        } else { // user & ticket 
            const response = await authlete.continueAuthorization(ticket, user);
            if (response?.action == "LOCATION") {
                return res.redirect(response.responseContent);
            }
            return res.status(400).json(response);
        }
    };
}
export async function tokenHandler(req: Request, res: Response, next: NextFunction) {
    const rawRequest = req.body;
    console.log(rawRequest);
    const { action, responseContent } = await authlete.handleTokenRequest(rawRequest);
    res.json(JSON.parse(responseContent));
}
export function createDefaultBackend(authenticationHandler: RequestHandler) {

    const router = express();
    router.get('/oauth/authorize', ensureAuthleteContext, createAuthorizationHandler(authenticationHandler));
    router.post("/oauth/token", tokenHandler);

    router.get('/.well-known/openid-configuration', async (req, res, next) => {
        const metadata = await authlete.fetchOpenIdMetadata();
        res.json(metadata);
    });
    return router;
}

