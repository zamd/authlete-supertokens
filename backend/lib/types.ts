



export type AuthleteConfig = {
    apiKey: string;
    apiSecret: string;
    baseUrl: string;
};export interface AuthleteRequestContext {
    user: AuthleteUser | null;
    response: AuthleteResponse | null;
    ticket: string | null;
}



export interface AuthleteUser {
    sub: string;
}

export interface AuthleteResponse {
    type: string;
    resultCode: string;
    resultMessage: string;
    acrEssential: boolean;
    action: AuthleteAction;
    clientEntityIdUsed: boolean;
    clientIdAliasUsed: boolean;
    maxAge: number;
    responseContent: string;
    service: Service;
    ticket: string;
}
type AuthleteAction = 'BAD_REQUEST' |
    'FORM' |
    'INTERACTION' |
    'INTERNAL_SERVER_ERROR' |
    'LOCATION' |
    'NO_INTERACTION';

export interface GetParameters {
    parameters: string;
}
interface PostParameters {
    parameters: string;
}
interface Service {
}

