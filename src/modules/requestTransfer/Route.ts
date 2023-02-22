import { Router } from "express";
import { Main } from "./Main";
import { authentication } from "../../middlewares/Authentication";

const routerRequestTransfer = Router();

routerRequestTransfer.post('/request-transfer', authentication, Main.createRequestTransfer);
routerRequestTransfer.get('/request-transfer/:walletAddress', authentication, Main.getRequestTransfer);
routerRequestTransfer.put('/request-transfer/verify/:walletAddress', authentication, Main.verifyRequest);
export default routerRequestTransfer;