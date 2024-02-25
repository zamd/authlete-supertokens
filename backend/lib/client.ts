import axios, { AxiosInstance } from "axios";
import { debug } from '.';
import { GetParameters, AuthleteResponse, AuthleteUser } from './types';
import { AuthleteConfig } from './types';

export class AuthleteClient {
    private axiosInstance: AxiosInstance;
    constructor(private config: AuthleteConfig) {
        this.axiosInstance = axios.create({
            baseURL: config.baseUrl,
            timeout: 10000,
            auth: {
                username: config.apiKey,
                password: config.apiSecret
            }
        });
    }

    async fetchOpenIdMetadata() {
        const response = await this.axiosInstance.get("/service/configuration");
        return response.data;
    }

    async handleTokenRequest(rawRequest: any) {
        debug("proxying /token request to authlete service.");
        const response = await this.axiosInstance.post("/auth/token", { parameters: rawRequest });
        debug(`response: ${response.status}`);
        debug(`authlete response: ${JSON.stringify(response.data)}`);
        return response.data;
    }


    async startAuthorization(parameters: GetParameters): Promise<AuthleteResponse | null> {
        try {
            const payload = {
                ...parameters
            };
            debug(`invoking authlete authorization`);
            const response = await this.axiosInstance.post("/auth/authorization", payload);
            debug(`response: ${response.status}`);
            if (response.status === 200) {
                const authleteReponse: AuthleteResponse = response.data;
                return authleteReponse;
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
            // Handle errors
            console.error('Error:', "error");
            return null;
        }
    }

    async continueAuthorization(ticket: string, user: AuthleteUser) {
        try {
            const payload = {
                ticket,
                subject: user.sub
            };
            debug(`completing authlete authorization`);
            const response = await this.axiosInstance.post("/auth/authorization/issue", payload);
            debug(`response: ${response.status}`);
            if (response.status === 200) {
                const authleteReponse: AuthleteResponse = response.data;
                return authleteReponse;
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
            // TODO: Handle errors
            console.error('Error:', "error");
            return null;
        }
    }

}
