import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AccountEntity } from 'src/modules/account/account.entity';
import { AccountService } from 'src/modules/account/account.service';
import { KratosService } from 'src/shared/services/kratos.service';

export interface RequestWithAuthAccount extends Request {
    account: AccountEntity;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private kratosService: KratosService,
        private accountService: AccountService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: RequestWithAuthAccount = context
            .switchToHttp()
            .getRequest();
        // console.log(request.cookies)
        const { ory_kratos_session } = request.cookies;

        if (!ory_kratos_session) return false;

        try {
            const res = await this.kratosService.getAccountFromSession(
                ory_kratos_session,
                request.headers.cookie,
            );

            const ory_id = res.data.identity.id;

            const account = await this.accountService.findOneByOryId(ory_id);

            console.log(account);

            // get account
            request.account = account;

            return true;
        } catch (err) {
            console.log(err.response.data);
            return false;
        }
    }
}
