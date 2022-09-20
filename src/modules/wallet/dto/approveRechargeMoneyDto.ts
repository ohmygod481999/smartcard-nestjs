import { IsNumber } from 'class-validator';

export class ApproveRechargeMoneyDto {
    @IsNumber()
    recharge_register_id: number;
}
