import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithAuthAccount } from 'src/guards/auth.guard';

export const Authentication = createParamDecorator(
    (_, context: ExecutionContext) => {
        const request: RequestWithAuthAccount = context
            .switchToHttp()
            .getRequest();

        const { account } = request;
        return account;
    },
);