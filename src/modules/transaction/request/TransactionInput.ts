import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator-multi-lang";

export class TransactionInput {

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsOptional()
    message: string;

    @IsNotEmpty()
    @IsString()
    @Length(36, 36)
    walletAddressSource: string;

    @IsNotEmpty()
    @IsString()
    @Length(36, 36)
    walletAddressDestination: string;


    constructor(transaction: TransactionInput) {
        this.amount = transaction.amount;
        this.message = transaction.message;
        this.walletAddressSource = transaction.walletAddressSource;
        this.walletAddressDestination = transaction.walletAddressDestination;
    }
}