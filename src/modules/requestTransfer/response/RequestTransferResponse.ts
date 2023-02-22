import { STATUS } from "../../../Constant";

export class RequestTransferResponse{

    amount: number;

    message: string;

    txHash: string;

    unit: string;

    status: STATUS;

    constructor(requestTransferResponse: RequestTransferResponse) {
        this.amount = requestTransferResponse.amount;
        this.message = requestTransferResponse.message;
        this.txHash = requestTransferResponse.txHash;
        this.unit = requestTransferResponse.unit;
        this.status = requestTransferResponse.status;
    }
}