import CustomRequest from "../../dataTypes/request/CustomRequest";

require('dotenv').config();
import neo4j from 'neo4j-driver';

const {
    NEO4J_HOST_WALLET,
    NEO4J_USERNAME_WALLET,
    NEO4J_PASSWORD_WALLET,
    NEO4J_DATABASE_WALLET,
    NEO4J_HOST,
    NEO4J_USERNAME,
    NEO4J_PASSWORD,
    NEO4J_DATABASE
}: any = process.env;

const driver = neo4j.driver(
    NEO4J_HOST_WALLET as string,
    neo4j.auth.basic(NEO4J_USERNAME_WALLET as string, NEO4J_PASSWORD_WALLET as string),
    { disableLosslessIntegers: true }
);

try {
    driver.verifyConnectivity();
    console.log('Driver Wallet created');
} catch (error) {
    console.log(`connectivity verification failed. ${error}`);
}

export const getSessionWallet = async (req: CustomRequest) => {
    if (req.neo4jSessionWallet)
        await req.neo4jSessionWallet.close();
    req.neo4jSessionWallet = driver.session({
        database: NEO4J_DATABASE_WALLET
    });
    return req.neo4jSessionWallet;
};

const driverNeo4j = neo4j.driver(
    NEO4J_HOST as string,
    neo4j.auth.basic(NEO4J_USERNAME as string, NEO4J_PASSWORD as string),
    { disableLosslessIntegers: true }
);

try {
    driverNeo4j.verifyConnectivity();
    console.log('Driver Neo4j created');
} catch (error) {
    console.log(`connectivity verification failed. ${error}`);
}

export const getSession = async (req: CustomRequest) => {
    if (req.neo4jSession)
        await req.neo4jSession.close();
    req.neo4jSession = driverNeo4j.session({
        database: NEO4J_DATABASE
    });
    return req.neo4jSession;
};