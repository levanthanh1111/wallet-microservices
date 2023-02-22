import CustomRequest from "../../dataTypes/request/CustomRequest";
import { Response } from "express";
import { Controller } from "./Controller";
import Logger from "../../exceptions/Logger";
import { ServerInternal } from "../../exceptions/ServerInternal";

export class Main {
    public static async createRequestTransfer(req: CustomRequest, res: Response): Promise<void> {
        try{
            const result = await Controller.createRequestTransfer(req);
            res.status(result.code).json(result);
        }   catch (e){
            Logger.error(e);
            ServerInternal(res, e);
        }
    }
    public static async getRequestTransfer(req: CustomRequest, res: Response): Promise<void> {
        try{
            const result = await Controller.getRequestTransfer(req, req.query);
            res.status(result.code).json(result);
        }catch (e){
            Logger.error(e);
            ServerInternal(res, e);
        }
    }

    public static async verifyRequest(req: CustomRequest, res: Response): Promise<void> {
        try{
            const result = await Controller.verifyRequest(req);
            res.status(result.code).json(result);

        }catch (e){
            Logger.error(e);
            ServerInternal(res, e);
        }
    }
}