import neo4j, { Session } from "neo4j-driver";
import { Neo4jLabel } from "../../services/database/Neo4jLabel";
import { TransactionResponse } from "./response/TransactionResponse";
import { HistoryResponse } from "./interfaces/HistoryResponse";
import { TOTAL_PAGE_DEFAULT } from "../../Constant";

export class Repository{
    public static async createTransaction(walletAddressSource: string,
                                          walletAddressDestination: string,
                                          amount: number,
                                          transaction: object,
                                          session: Session): Promise<boolean>{
        const record = (await session.run(`
                      MATCH(walletSource:${Neo4jLabel.MODEL_WALLET.WALLET} {walletAddress: $walletAddressSource}),
                        (walletDes:${Neo4jLabel.MODEL_WALLET.WALLET} {walletAddress: $walletAddressDestination})
                      CREATE(walletSource)-[h:${Neo4jLabel.RELATIONSHIP.HISTORY} $transaction]->(walletDes)
                      SET walletSource.amount = walletSource.amount - $amount
                      SET walletDes.amount = walletDes.amount + $amount
                      RETURN h as history`,
            {
                        walletAddressSource,
                        walletAddressDestination,
                        amount,
                        transaction
                     })).records[0];
        return record !== undefined;
    }

    public static async getAmountAccount(walletAddressSource: string, session: Session): Promise<number | undefined>{
        const record = (await session.run(`
                        MATCH(wallet:${Neo4jLabel.MODEL_WALLET.WALLET} {walletAddress:$walletAddressSource})
                        RETURN wallet.amount as amount`,
            { walletAddressSource })
        ).records[0];
        if (record === undefined)
            return undefined;
        return record.get('amount');
    }

    public static async getHistoryTransaction(
        limit: number,
        skip: number,
        walletAddress: string,
        session: Session
    ): Promise<{
        data: HistoryResponse[];
        totalPage: number
    }>{
        const queryLimit = neo4j.int(limit);
        const querySkip = neo4j.int(skip);
        let data : HistoryResponse[];
        let totalPage: number;
        const record = await session.run(`
                        MATCH(:${Neo4jLabel.MODEL_WALLET.WALLET}{walletAddress:$walletAddress})
                        -[history:${Neo4jLabel.RELATIONSHIP.HISTORY}]
                        -(:${Neo4jLabel.MODEL_WALLET.WALLET})
                        CALL {
                            MATCH(:${Neo4jLabel.MODEL_WALLET.WALLET}{walletAddress:$walletAddress})
                            -[history:${Neo4jLabel.RELATIONSHIP.HISTORY}]
                            -(:${Neo4jLabel.MODEL_WALLET.WALLET})
                            RETURN count(history) as countHistory
                        }
                        RETURN startNode(history) as wallet, history, countHistory
                        ORDER BY history.createdAt DESC
                        SKIP $querySkip
                        LIMIT $queryLimit
                        `,
            { walletAddress, queryLimit, querySkip });
        data = record.records.map((item: any) => {
            const history = new TransactionResponse(item.get('history').properties);
            const action = item.get('wallet').properties.walletAddress === walletAddress ? 'sent' : 'received';
            return {
                history,
                action
            };
        });
        totalPage = Math.ceil((record.records[0]?.get('countHistory') || TOTAL_PAGE_DEFAULT) / limit);
        return {
            data,
            totalPage
        };
    }

}