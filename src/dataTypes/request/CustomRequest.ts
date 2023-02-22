import { Request } from "express";
import { Session } from "neo4j-driver";

type customRequest = Request & {
    languageFile?: {
        [key: string]: string
    };
    walletAddress?: string;
    neo4jSession?: Session;
    neo4jSessionWallet?: Session;
    salt?: string;
};
export default customRequest;