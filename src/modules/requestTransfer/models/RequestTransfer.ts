import { STATUS, TYPE, UNIT } from "../../../Constant";
import uuid4 from "uuid4";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator-multi-lang";
import { RequestTransferInput } from "../request/RequestTransferInput";


export class RequestTransfer {

    txHash: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    createdAt: number;

    updatedAt: number;

    // waiting/accept/deny
    status: STATUS;

    @IsOptional()
    message: string;

    type: number;

    unit: string;

    constructor(request: RequestTransferInput) {
        const now = new Date();
        this.txHash = uuid4();
        this.amount = request.amount;
        this.createdAt = now.getTime();
        this.updatedAt = now.getTime();
        this.status = STATUS.WAITING;
        this.message = request.message;
        this.type = TYPE.REQUEST_TRANSFER;
        this.unit = UNIT.DPO;
    }
}