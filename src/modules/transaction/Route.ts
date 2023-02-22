import { Router } from "express";
import { Main } from "./Main";
import { authentication } from "../../middlewares/Authentication";


const routerTransaction = Router();
routerTransaction.post('/transaction', authentication, Main.createTransaction);
routerTransaction.get('/transaction/:walletAddress', authentication, Main.getHistoryTransaction);

export default routerTransaction;