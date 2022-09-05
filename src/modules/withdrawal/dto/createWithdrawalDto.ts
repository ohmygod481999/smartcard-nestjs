import { IsNumber } from 'class-validator';
import { WithdrawalStatus } from '../withdrawal.entity';

export class CreateWithdrawalDto {
    @IsNumber()
    account_id: number;

    status: WithdrawalStatus;

    @IsNumber()
    amount: number;
}
