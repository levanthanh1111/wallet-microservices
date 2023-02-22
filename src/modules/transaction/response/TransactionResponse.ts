export class TransactionResponse{

    amount: number;

    message: string;

    txHash: string;

    unit: string;


    constructor(transaction: TransactionResponse) {
        this.amount = transaction.amount;
        this.message = transaction.message;
        this.txHash = transaction.txHash;
        this.unit = transaction.unit;
    }
}