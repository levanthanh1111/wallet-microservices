import uuid4 from "uuid4";
import { TYPE, UNIT } from "../../../Constant";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator-multi-lang";
import { TransactionInput } from "../request/TransactionInput";

export class Transaction {

    txHash: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    createdAt: number;
    @IsOptional()
    message: string;

    unit: string;

    type: number;

    constructor(transaction: TransactionInput) {
        const now = new Date();
        this.txHash = uuid4();
        this.amount = transaction.amount;
        this.createdAt = now.getTime();
        this.message = transaction.message;
        this.unit = UNIT.DPO;
        this.type = TYPE.TRANSFER;
    }
}