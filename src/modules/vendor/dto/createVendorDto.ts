import { IsNumber, IsString } from 'class-validator';

export class CreateVendorDto {
    @IsString()
    name: string;

    @IsNumber()
    account_id: number;
}
