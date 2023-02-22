import { Response } from "express";
export const ServerInternal = (res: Response, error: any) => {
    res.status(500).json({
        code: 500,
        success: false,
        message: "Server Internal Error",
        error
    });
};