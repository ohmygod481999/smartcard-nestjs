import { IsUUID } from 'class-validator';

export class AcceptWithdrawalDto {
    @IsUUID()
    withdrawal_id: string;
}
