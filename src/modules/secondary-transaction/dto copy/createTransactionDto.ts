import { IsEnum, IsNumber } from "class-validator";
import { SecondaryTransactionType } from "../secondary-transaction.entity";

export class CreateSecondaryTransactionDto {
    @IsNumber()
    account_id: number

    @IsNumber()
    amount: number

    @IsEnum(SecondaryTransactionType)
    type: SecondaryTransactionType
}