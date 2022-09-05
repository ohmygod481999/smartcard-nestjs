import { IsNumber } from "class-validator";

export class ConnectCardWithAccountDto {
    @IsNumber()
    card_id: number

    @IsNumber()
    account_id: number
}