import { SubmitSelfServiceRegistrationFlowWithPasswordMethodBody } from '@ory/client';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
    @IsString()
    readonly flowId: string;

    readonly data: SubmitSelfServiceRegistrationFlowWithPasswordMethodBody;

    readonly myData: {
        cardId: number;
        referrerCode: string;
    };
}
