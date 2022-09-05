import { IsNumber } from 'class-validator';
import { WithdrawalStatus } from '../withdrawal.entity';

export class RegisterWithdrawalDto {
    @IsNumber()
    account_id: number;

    @IsNumber()
    amount: number;
}
