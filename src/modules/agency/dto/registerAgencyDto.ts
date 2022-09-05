import { SubmitSelfServiceRegistrationFlowWithPasswordMethodBody } from '@ory/client';
import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import { AgencyRegisterStatus } from '../agency-register.entity';

export class RegisterAgencyDto {
    @IsNumber()
    account_id: number;
}
