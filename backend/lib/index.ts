import debugModule from "debug";
import { AuthleteRequestContext } from './types';
import { useSuperTokenAuthentication } from "./integrations/supertokens";
import { createDefaultBackend } from "./middleware";

export const debug = debugModule("node-authlete")


declare global {
    namespace Express {
        export interface Request {
            authlete: AuthleteRequestContext;
        }
    }
}

export {
    useSuperTokenAuthentication, 
    createDefaultBackend
}


