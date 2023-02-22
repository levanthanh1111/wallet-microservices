import CustomRequest from "../../dataTypes/request/CustomRequest";
import { Response } from "express";
import Logger from "../../exceptions/Logger";
import { ServerInternal } from "../../exceptions/ServerInternal";
import { Controller } from "./Controller";

export class Main {
    public static async createTransaction(req: CustomRequest, res: Response): Promise<void>{
        try{
            const result = await Controller.createTransaction(req);
            res.status(result.code).json(result);
        }   catch (e){
            Logger.error(e);
            ServerInternal(res, e);
        }
    }
    public static async getHistoryTransaction(req: CustomRequest, res: Response): Promise<void>{
        try{
            const result = await Controller.getHistoryTransaction(req);
            res.status(result.code).json(result);
        }catch (e){
            Logger.error(e);
            ServerInternal(res, e);
        }
    }
}