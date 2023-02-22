import CustomRequest from "../../dataTypes/request/CustomRequest";
import { Repository } from "./Repository";
import { TransactionInput } from "./request/TransactionInput";
import { Transaction } from "./models/Transaction";
import CustomResponse from "../../dataTypes/response/CustomResponse";
import { getSessionWallet } from "../../services/database/ConnectDatabaseNeo4j";
import i18n from "i18n";
import ValidateInput from "../../helpers/ValidateInput";
import { LIMIT_DEFAULT, PAGE_DEFAULT } from "../../Constant";

export class Controller {
    public static async createTransaction(req: CustomRequest): Promise<CustomResponse>{
        const transactionInput = new TransactionInput(req.body);
        const validatedInput = await ValidateInput<Transaction>(
            req,
            transactionInput,
            i18n.__('BAD REQUEST')
        );
        if (validatedInput !== null)
            return validatedInput;
        const { body: {
            walletAddressSource,
            walletAddressDestination,
            amount
        } }: any = req;
        if (walletAddressDestination === walletAddressSource)
            return {
                code: 400,
                success: false,
                message: i18n.__('CANNOT TRANSFER')
            };
        const amountAccount = await Repository.getAmountAccount(walletAddressSource, await getSessionWallet(req));
        if (amountAccount === undefined)
            return {
                code: 400,
                success: false,
                message: i18n.__('BAD REQUEST')
            };
        if (amountAccount < amount)
            return {
                code: 400,
                success: false,
                message: i18n.__('NOT ENOUGH DAK POINT')
            };

        const transaction = new Transaction(transactionInput);

        const data = await Repository.createTransaction(
            walletAddressSource,
            walletAddressDestination,
            amount,
            transaction,
            await getSessionWallet(req)
        );

        if (data)
            return {
                code: 200,
                success: true,
                message: i18n.__('SUCCESS')
            };

        return {
            code: 400,
            success: false,
            message: i18n.__('BAD REQUEST')
        };
    }

    public static async getHistoryTransaction(req: CustomRequest): Promise<CustomResponse>{
        const {
            limit = LIMIT_DEFAULT,
            page = PAGE_DEFAULT
        }: any = req.query;
        const customLimit = parseInt(limit as string, 10);
        const customPage = parseInt(page as string, 10);
        const skip = customLimit * (customPage - 1);
        const walletAddress = req.params.walletAddress;
        const { data, totalPage }: any = await Repository.getHistoryTransaction(
            customLimit,
            skip,
            walletAddress,
            await getSessionWallet(req)
        );
        return{
            code: 200,
            success: true,
            message: i18n.__('SUCCESS'),
            data,
            pagination: {
                limit: customLimit,
                page: customPage,
                totalPage
            }
        };
    }
}