import { AMOUNT_DEFAULT } from "../../../Constant";

import uuid4 from "uuid4";
export class Wallet {
    walletAddress: string;

    amount: string;

    createdAt: number;

    updatedAt: number;

    constructor() {
        const now = new Date();
        this.walletAddress = uuid4();
        this.createdAt = now.getTime();
        this.updatedAt = now.getTime();
        this.amount = AMOUNT_DEFAULT;
    }
}