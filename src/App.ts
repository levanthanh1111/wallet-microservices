import bodyParser from 'body-parser';
import express from 'express';
import i18n from 'i18n';
import path from 'path';
import cors from 'cors';
import routerWallet from "./modules/wallet/Route";
import routerTransaction from "./modules/transaction/Route";
import languageTranslate from './middlewares/LanguageTranslate';
import routerRequestTransfer from "./modules/requestTransfer/Route";
import { CleanupSession } from "./services/database/CleanupSession";

i18n.configure({
    locales: ['en', 'vi', 'th', 'ind', 'fi'],
    directory: path.join(__dirname, 'languages/i18n'),
    defaultLocale: 'vi',
    register: global,
    objectNotation: true
});

const app = express();

app.use(CleanupSession);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(i18n.init);
app.use(languageTranslate as any);
app.use('/api', routerWallet);
app.use('/api', routerTransaction);
app.use('/api', routerRequestTransfer);

export default app;