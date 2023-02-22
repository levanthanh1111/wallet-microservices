import { NextFunction } from "express";
import { readFileSync } from "fs";
import path from 'path';
import i18n from "i18n";
import CustomRequest from "../dataTypes/request/CustomRequest";

const withTranslate = (req: CustomRequest, _res: Response, next: NextFunction) => {
    let locale = req.query.locale;
    let pathname;

    if (!locale)
        locale = 'vi';
    switch (locale) {
        case 'en':
            pathname = '../languages/class-validator/en.json';
            break;
        case 'vi':
            pathname = '../languages/class-validator/vi.json';
            break;
        case 'th':
            pathname = '../languages/class-validator/th.json';
            break;
        case 'fi':
            pathname = '../languages/class-validator/fi.json';
            break;
        case 'ind':
            pathname = '../languages/class-validator/ind.json';
            break;
        default: console.log('');
    }

    i18n.setLocale(locale as string);
    req.languageFile = JSON.parse(readFileSync(path.join(__dirname, pathname as string)).toString());
    return next();
};

export default withTranslate;