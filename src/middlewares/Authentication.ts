import CustomRequest from "../dataTypes/request/CustomRequest";
import { NextFunction, Response } from "express";
import i18n from "i18n";
import jwt from 'jsonwebtoken';
require('dotenv').config();

export const authentication = (req: CustomRequest, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization;
    if (!bearerToken)
        return res.status(401).json({
            message: i18n.__('UNAUTHORIZATION')
        });
    const token = bearerToken.split(' ')[1];
    jwt.verify(token, process.env.SECRET_JWT as string, (error: any, decode: any) => {
        if (error)
            return res.status(401).json({
                message: error.message
            });
        if (process.env.ACCESS_TOKEN_SALT === (decode as any).salt)
            return next();
        return res.status(400).json({
            message: i18n.__('BAD REQUEST')
        });
    });
};