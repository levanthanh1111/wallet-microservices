import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator-multi-lang";

export class RequestTransferInput {

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


    constructor(request: RequestTransferInput) {
        this.amount = request.amount;
        this.message = request.message;
        this.walletAddressSource = request.walletAddressSource;
        this.walletAddressDestination = request.walletAddressDestination;
    }
}