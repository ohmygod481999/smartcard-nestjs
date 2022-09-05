import { IsNumber } from "class-validator";

export class CreateSecondaryTransactionDto {
    @IsNumber()
    account_id: number

    @IsNumber()
    amount: number
}