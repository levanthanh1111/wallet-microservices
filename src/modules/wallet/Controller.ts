import Repository from "./Repository";
import CustomResponse from "../../dataTypes/response/CustomResponse";
import i18n from "i18n";
import { Wallet } from "./models/Wallet";
import CustomRequest from "../../dataTypes/request/CustomRequest";
import { getSession, getSessionWallet } from "../../services/database/ConnectDatabaseNeo4j";

export default class Controller {
    public static async createWallet(req: CustomRequest): Promise<CustomResponse>{

        const wallet = new Wallet();
        const data = await Repository.createWallet(wallet, await getSessionWallet(req), await getSession(req));
        if (data === undefined)
            return {
                code: 400,
                success: false,
                message: i18n.__('BAD REQUEST')
            };
        return {
            code: 201,
            success: true,
            message: i18n.__('CREATE WALLET SUCCESS'),
            data
        };
    }

    public static async getWalletByAddress(req: CustomRequest): Promise<CustomResponse> {
        if ((req.params.walletAddress).length !== 36)
            return {
                code: 400,
                success: false,
                message: i18n.__('WRONG FORMAT WALLET ADDRESS')
            };
        const data = await Repository.getWalletByAddress(req.params.walletAddress, await getSessionWallet(req));
        if (data === undefined)
            return {
                code: 400,
                success: true,
                message: i18n.__('NOT FOUND')
            };
        return {
            code: 200,
            success: true,
            message: i18n.__('SUCCESS'),
            data
        };
    }
}