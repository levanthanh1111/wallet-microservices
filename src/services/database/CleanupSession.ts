import CustomRequest from "../../dataTypes/request/CustomRequest";
import { NextFunction, Response } from "express";

export const CleanupSession = (req: CustomRequest, res: Response, next: NextFunction) => {
    res.on('finish',  () => {
        if (req.neo4jSessionWallet){
            req.neo4jSessionWallet.close();
            delete req.neo4jSessionWallet;
        }
        if (req.neo4jSession){
            req.neo4jSession.close();
            delete req.neo4jSession;
        }
    });
    next();
};