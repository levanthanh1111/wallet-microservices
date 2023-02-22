import CustomRequest from "../../dataTypes/request/CustomRequest";
import CustomResponse from "../../dataTypes/response/CustomResponse";
import { Repository } from "./Repository";
import { getSessionWallet } from "../../services/database/ConnectDatabaseNeo4j";
import { RequestTransferInput } from "./request/RequestTransferInput";
import { RequestTransfer } from "./models/RequestTransfer";
import ValidateInput from "../../helpers/ValidateInput";
import { UpdateRequestInput } from "./request/UpdateRequestInput";
import { LIMIT_DEFAULT, PAGE_DEFAULT, STATUS } from "../../Constant";

export class Controller {
    public static async createRequestTransfer(req: CustomRequest): Promise<CustomResponse>{
        const requestTransferInput = new RequestTransferInput(req.body);
        const validateInput = await ValidateInput<RequestTransfer>(
            req,
            requestTransferInput,
            i18n.__('BAD REQUEST')
        );
        if (validateInput !== null)
            return validateInput;
        const { body: {
            walletAddressSource,
            walletAddressDestination
        } }: any = req;
        if (walletAddressDestination === walletAddressSource)
            return {
                code: 400,
                success: false,
                message: i18n.__('CANNOT TRANSFER')
            };
        const requestTransfer = new RequestTransfer(requestTransferInput);
        const data = await Repository.createRequestTransfer(
            walletAddressSource,
            walletAddressDestination,
            requestTransfer,
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
    public static async getRequestTransfer(req: CustomRequest, query: any): Promise<CustomResponse>{
        const {
            type,
            limit = LIMIT_DEFAULT,
            page = PAGE_DEFAULT
        }: any = query;
        const customLimit = parseInt(limit as string, 10);
        const customPage = parseInt(page as string, 10);
        const walletAddress = req.params.walletAddress;
        if (!(type === 'sent' || type === 'received'))
            return {
                code: 400,
                success: false,
                message: i18n.__('INVALID TYPE')
            };
        const skip = customLimit * (customPage - 1);
        const { data, totalPage }: any = await Repository.getRequestTransfer(
            type,
            customLimit,
            skip,
            walletAddress,
            await getSessionWallet(req)
        );
        return {
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

    public static async verifyRequest(req : CustomRequest): Promise<CustomResponse>{
        const requestInput = new UpdateRequestInput(req.body);
        const validateInput = await ValidateInput<RequestTransfer>(
            req,
            requestInput,
            i18n.__('BAD REQUEST')
        );
        if (validateInput !== null)
            return validateInput;
        const { body: {
            txHash,
            status
        } }: any = req;
        const walletAddress = req.params.walletAddress;
        const statusDefault = await Repository.getStatus(txHash, walletAddress, await getSessionWallet(req));
        if (statusDefault === STATUS.WAITING){
            if (status === STATUS.ACCEPT){
                const amountAccount = await Repository.getAmountAccount(walletAddress, await getSessionWallet(req));
                if (amountAccount === undefined)
                    return {
                        code: 400,
                        success: false,
                        message: i18n.__('BAD REQUEST')
                };
                const amountRequest = await Repository.getAmountRequest(txHash, walletAddress, await getSessionWallet(req));
                if (amountRequest === undefined)
                    return {
                        code: 400,
                        success: false,
                        message: i18n.__('BAD REQUEST')
                    };
                if (amountAccount < amountRequest)
                    return {
                        code: 400,
                        success: false,
                        message: i18n.__('NOT ENOUGH DAK POINT')
                    };
            }
            const data = await Repository.verifyRequest(
                walletAddress,
                txHash,
                status,
                await getSessionWallet(req)
            );
            if (data)
                return {
                    code: 200,
                    success: true,
                    message: i18n.__('UPDATE SUCCESS')
                };
            return {
                code: 400,
                success: false,
                message: i18n.__('UPDATE FAIL')
            };
        }
        if (statusDefault === undefined)
            return {
                code: 400,
                success: false,
                message: i18n.__('BAD REQUEST')
            };
        return {
            code: 400,
            success: false,
            message: i18n.__('UPDATE BEFORE')
        };
    }
}