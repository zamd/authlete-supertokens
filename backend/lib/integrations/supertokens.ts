import { Request, Response, NextFunction } from "express";
import Session from "supertokens-node/recipe/session";
import supertokens from "supertokens-node";

export function useSuperTokenAuthentication(superTokensDomain: string) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const session = await Session.getSession(req, res, { sessionRequired: false });
        if (session)
            return next();

        const host = req.get('host') || '';
        const protocol = req.get('x-forwarded-proto') || req.protocol;

        let fullUrl = `${protocol}://${host}${req.originalUrl}`;
        const resumeUrl = `/resume?url=${encodeURIComponent(fullUrl)}`;

        const rurl = new URL("/auth", superTokensDomain);
        rurl.searchParams.set("redirectToPath", resumeUrl);

        return res.redirect(rurl.href);
    };
}

export async function ensureAuthleteContext(req: Request, res: Response, next: NextFunction) {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    //initialize context.
    req.authlete = { user: null, response: null, ticket: null };
    if (session) {
        const userId = session.getUserId();
        //use email or userId as sub
        const { emails }: { emails?: string[]; } = await supertokens.getUser(userId) || {};
        const sub = (emails && emails.length > 0) ? emails[0] : userId;
        req.authlete.user = { sub };
    }
    next();
}

