import Logger from "../../exceptions/Logger";
import { ServerInternal } from "../../exceptions/ServerInternal";
import Controller from "./Controller";
import { Response } from "express";
import CustomRequest from "../../dataTypes/request/CustomRequest";

export default class Main {
    public static async createWallet(req: CustomRequest, res: Response): Promise<void>{
        try{
            const result = await Controller.createWallet(req);
            res.status(result.code).json(result);
        }catch (e){
            Logger.error(e);
            ServerInternal(res, e);
        }
    }

    public static async getWalletByAddress(req: CustomRequest, res: Response): Promise<void>{
        try{
            const result = await Controller.getWalletByAddress(req);
            res.status(result.code).json(result);
        }catch (e){
            Logger.error(e);
            ServerInternal(res, e);
        }
    }

}