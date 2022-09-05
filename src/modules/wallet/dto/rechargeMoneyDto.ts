import { IsNumber } from 'class-validator';

export class RechargeMoneyDto {
    @IsNumber()
    account_id: number;

    @IsNumber()
    amount: number;
}
