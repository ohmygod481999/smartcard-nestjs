import { IsNumber, IsString } from 'class-validator';

export class RegisterErpNewCompanyDto {
    @IsNumber()
    account_id: number;

    @IsString()
    company_name: string;
}

export class RegisterErpExistCompanyDto {
    @IsNumber()
    account_id: number;

    @IsNumber()
    company_id: number;
}
