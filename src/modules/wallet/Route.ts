import { Router } from "express";
import Main from "./Main";
import { authentication } from "../../middlewares/Authentication";

const routerWallet = Router();

routerWallet.post('/wallet', authentication, Main.createWallet);
routerWallet.get('/wallet/:walletAddress', authentication, Main.getWalletByAddress);
export default routerWallet;