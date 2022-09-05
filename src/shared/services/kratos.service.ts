import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    Configuration,
    Session,
    SubmitSelfServiceRegistrationFlowBody,
    SuccessfulSelfServiceRegistrationWithoutBrowser,
    V0alpha2Api,
} from '@ory/client';
import { AxiosResponse } from 'axios';

@Injectable()
export class KratosService {
    private readonly kratos: V0alpha2Api;

    constructor(public configService: ConfigService) {
        this.kratos = new V0alpha2Api(
            new Configuration({
                basePath: configService.get('KRATOS_URL'),
            }),
        );
    }

    public register(
        flowId: string,
        data: SubmitSelfServiceRegistrationFlowBody,
        cookiesString: string,
    ): Promise<AxiosResponse<SuccessfulSelfServiceRegistrationWithoutBrowser>> {
        return this.kratos.submitSelfServiceRegistrationFlow(
            flowId,
            data,
            cookiesString,
        );
    }

    public getAccountFromSession(
        ory_kratos_session: string,
        cookieString: string
    ): Promise<AxiosResponse<Session>> {
        return this.kratos.toSession(undefined, cookieString);
    }
}
