import { IsBoolean, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { AgencyRegisterStatus } from '../agency-register.entity';

export class AcceptAgencyDto {
    @IsNumber()
    agency_register_id: number;

    @IsBoolean()
    accept: boolean;
}
