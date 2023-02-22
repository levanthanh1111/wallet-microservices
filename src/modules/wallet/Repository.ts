import { Neo4jLabel } from "../../services/database/Neo4jLabel";
import { Session } from "neo4j-driver";
import { WalletResponse } from "./response/WalletResponse";

export default class Repository {
    public static async createWallet(wallet: object, sessionWallet: Session, session: Session): Promise<WalletResponse | undefined> {

        const amountDefault = (await session.run(`
                                MATCH(p:${Neo4jLabel.MODEL.POLICY_REWARD})
                                -->(r:${Neo4jLabel.MODEL.REGISTER})
                                RETURN r.amount as amount`, {})).records[0].get('amount');

        const record = (await sessionWallet.run(`
                           CREATE (a: ${Neo4jLabel.MODEL_WALLET.WALLET} $wallet) set a.amount = $amountDefault
                           RETURN a`,
                    {
                            amountDefault,
                            wallet
                            })).records[0];
        if (record === undefined)
            return undefined;
        return new WalletResponse(record.get('a')?.properties);
    }

    public static async getWalletByAddress(walletAddress: string, sessionWallet: Session): Promise<WalletResponse | undefined>{
        const record = (await sessionWallet.run(`
                        MATCH(wallet:${Neo4jLabel.MODEL_WALLET.WALLET}{walletAddress: $walletAddress})
                        RETURN wallet`, { walletAddress })).records[0];
        if (record === undefined)
            return undefined;
        return (new WalletResponse(record.get('wallet')?.properties));
    }
}