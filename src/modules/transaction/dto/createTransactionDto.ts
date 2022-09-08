import { IsEnum, IsNumber, IsString } from 'class-validator';
import {
    TransactionSourceType,
    TransactionStatusEnum,
    TransactionTargetType,
    TransactionTypeEnum,
} from '../transaction.entity';

export class CreateTransactionDto {
    @IsEnum(TransactionStatusEnum)
    status: TransactionStatusEnum;

    @IsEnum(TransactionTypeEnum)
    type: TransactionTypeEnum;

    @IsNumber()
    source_id: number;

    @IsNumber()
    target_id: number;

    @IsNumber()
    amount: number;

    @IsNumber()
    vendor_id?: number;

    @IsString()
    order_id?: string;

    @IsString()
    note?: string;
}
