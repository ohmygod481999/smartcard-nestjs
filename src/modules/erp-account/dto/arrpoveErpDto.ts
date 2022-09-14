import { IsNumber, IsString } from 'class-validator';

export class ApproveErpDto {
    @IsNumber()
    erp_account_id: number;
}
