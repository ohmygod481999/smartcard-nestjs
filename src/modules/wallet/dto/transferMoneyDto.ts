import { IsNumber, IsString } from "class-validator";

export class TransferMoneyDto {
    @IsNumber()
    source_id: number;

    @IsNumber()
    target_id: number;

    @IsNumber()
    amount: number;

    @IsString()
    note: string;
}