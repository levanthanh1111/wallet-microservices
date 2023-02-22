import neo4j, { Session } from "neo4j-driver";
import { Neo4jLabel } from "../../services/database/Neo4jLabel";
import { RequestTransferResponse } from "./response/RequestTransferResponse";
import { STATUS, TOTAL_PAGE_DEFAULT } from "../../Constant";

export class Repository {
    public static async createRequestTransfer(
        walletAddressSource: string,
        walletAddressDestination: string,
        requestTransfer: object,
        session: Session
    ): Promise<boolean> {
        const record = (await session.run(`
                      MATCH(walletSource:${Neo4jLabel.MODEL_WALLET.WALLET} {walletAddress: $walletAddressSource}),
                        (walletDes:${Neo4jLabel.MODEL_WALLET.WALLET} {walletAddress: $walletAddressDestination})
                      CREATE(walletSource)-[request:${Neo4jLabel.RELATIONSHIP.REQUEST_TRANSFER} $requestTransfer]->(walletDes)
                      RETURN request as request`,
            {
                    walletAddressSource,
                    walletAddressDestination,
                    requestTransfer
            })).records[0];
        return record !== undefined;

    }

    public static async getRequestTransfer(
        type: string,
        limit: number,
        skip: number,
        walletAddress: string,
        session: Session
    ): Promise<{
        data: RequestTransferResponse[],
        totalPage: number
    }> {
        const queryLimit = neo4j.int(limit);
        const querySkip = neo4j.int(skip);
        let data: RequestTransferResponse[] = [];
        let totalPage: number = TOTAL_PAGE_DEFAULT;
        if (type === 'received') {
            const record = await session.run(`
            Match (wallet:${Neo4jLabel.MODEL_WALLET.WALLET} {walletAddress: $walletAddress})
            <-[request:${Neo4jLabel.RELATIONSHIP.REQUEST_TRANSFER}]
            -(walletAll:${Neo4jLabel.MODEL_WALLET.WALLET})
            CALL {
                Match (wallet:${Neo4jLabel.MODEL_WALLET.WALLET})
                <-[request:${Neo4jLabel.RELATIONSHIP.REQUEST_TRANSFER}]
                -(walletAll:${Neo4jLabel.MODEL_WALLET.WALLET})
                WHERE (wallet.walletAddress='$walletAddress')
                RETURN COUNT(request) as count_request
            }
            RETURN request, count_request
            SKIP $querySkip
            LIMIT $queryLimit
            `, { walletAddress, querySkip, queryLimit });
            data = record.records.map((item: any) => {
                return new RequestTransferResponse(item.get('request').properties);
            });
            totalPage = Math.ceil((record.records[0]?.get('count_request') || TOTAL_PAGE_DEFAULT) / limit);
        }

        if (type === 'sent') {
            const record = await session.run(`
            Match (wallet:${Neo4jLabel.MODEL_WALLET.WALLET} {walletAddress: $walletAddress})
            -[request:${Neo4jLabel.RELATIONSHIP.REQUEST_TRANSFER}]
            ->(walletAll:${Neo4jLabel.MODEL_WALLET.WALLET})
            CALL {
                    Match (wallet:${Neo4jLabel.MODEL_WALLET.WALLET})
                    <-[request:${Neo4jLabel.RELATIONSHIP.REQUEST_TRANSFER}]
                    -(walletAll:${Neo4jLabel.MODEL_WALLET.WALLET})
                    WHERE (wallet.walletAddress='$walletAddress')
                    RETURN COUNT(request) as count_request
                }
            RETURN request, count_request
            SKIP $querySkip
            LIMIT $queryLimit
            `
            ,
                { walletAddress, querySkip, queryLimit });
            data = record.records.map((item: any) => {
                return new RequestTransferResponse(item.get('request').properties);
            });
            totalPage = Math.ceil((record.records[0]?.get('count_request') || TOTAL_PAGE_DEFAULT) / limit);
        }
        return {
            data,
            totalPage
        };
    }

    public static async verifyRequest(
        walletAddress: string,
        txHash: string,
        status: STATUS,
        session: Session
    ): Promise<boolean>{
        const record = (await session.run(`
        MATCH(wallet:${Neo4jLabel.MODEL_WALLET.WALLET}{walletAddress: $walletAddress})
        <-[req:${Neo4jLabel.RELATIONSHIP.REQUEST_TRANSFER} {txHash:$txHash}]
        -(walletAll:${Neo4jLabel.MODEL_WALLET.WALLET})
        SET req.status = $status
        RETURN req
        `,
            {
                walletAddress,
                txHash,
                status
            })).records[0];
        return record?.get('req') !== undefined;
    }

    public static async getAmountAccount(
        walletAddressSource: string,
        session: Session
    ): Promise<number | undefined>{
        const record = (await session.run(`
                        MATCH(wallet:${Neo4jLabel.MODEL_WALLET.WALLET} {walletAddress:$walletAddressSource})
                        RETURN wallet.amount as amount`,
            { walletAddressSource })).records[0];
        if (record === undefined)
            return undefined;
        return record.get('amount');
    }

    public static async getAmountRequest(
        txHash: string,
        walletAddressSource: string,
        session: Session
    ): Promise<number | undefined>{
        const record = (await session.run(`
                        MATCH(:${Neo4jLabel.MODEL_WALLET.WALLET} {walletAddress:$walletAddressSource})
                        <-[req:${Neo4jLabel.RELATIONSHIP.REQUEST_TRANSFER}{txHash:$txHash}]
                        -(:${Neo4jLabel.MODEL_WALLET.WALLET})
                        RETURN req.amount as amount`,
            { txHash, walletAddressSource })).records[0];
        if (record === undefined)
            return undefined;
        return record.get('amount');
    }
    public static async getStatus(
        txHash: string,
        walletAddressSource: string,
        session: Session
    ): Promise<string | undefined>{
        const record = (await session.run(`
                        MATCH(:${Neo4jLabel.MODEL_WALLET.WALLET} {walletAddress:$walletAddressSource})
                        <-[req:${Neo4jLabel.RELATIONSHIP.REQUEST_TRANSFER}{txHash:$txHash}]
                        -(:${Neo4jLabel.MODEL_WALLET.WALLET})
                        RETURN req.status as status`,
            { txHash, walletAddressSource })).records[0];
        if (record === undefined)
            return undefined;
        return record.get('status');
    }
}
