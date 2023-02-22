import { STATUS } from "../../../Constant";
import { IsEnum, IsNotEmpty, IsString, Length } from "class-validator-multi-lang";

export class UpdateRequestInput{
    @IsNotEmpty()
    @IsString()
    @Length(36, 36)
    txHash: string;

    @IsNotEmpty()
    @IsEnum(STATUS)
    status : STATUS;
    constructor(update: UpdateRequestInput) {
       this.txHash = update.txHash;
       this.status = update.status;
    }
}