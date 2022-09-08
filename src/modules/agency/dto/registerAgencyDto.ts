import { SubmitSelfServiceRegistrationFlowWithPasswordMethodBody } from '@ory/client';
import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import { AgencyRegisterStatus } from '../agency-register.entity';
import { AgencyType } from '../agency.entity';

export class RegisterAgencyDto {
    @IsNumber()
    account_id: number;

    @IsEnum(AgencyType)
    type: AgencyType
}
