import {
    Body,
    Controller,
    forwardRef,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Param,
    Post,
    Req,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Request } from 'express';
import { ResponseDto } from 'src/shared/dto/responseDto';
import { HelperService } from 'src/shared/services/helper.service';
import { KratosService } from 'src/shared/services/kratos.service';
import { DataSource } from 'typeorm';
import { CardService } from '../card/card.service';
import { ReferralService } from '../referral/referral.service';
import { SecondaryTransactionService } from '../secondary-transaction/secondary-transaction.service';
import {
    TransactionSourceType,
    TransactionStatusEnum,
    TransactionTargetType,
    TransactionTypeEnum,
} from '../transaction/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { AccountEntity } from './account.entity';
import { AccountService } from './account.service';
import { RegisterDto } from './dto/RegisterDto';

@Controller('account')
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly kratosService: KratosService,
        private readonly cardService: CardService,
        private readonly transactionService: TransactionService,
        private readonly dataSource: DataSource,
        private readonly helperService: HelperService,
        // @Inject(forwardRef(() => ReferralService))
        private readonly referralService: ReferralService,
        private readonly secondaryTransactionService: SecondaryTransactionService,
    ) {}

    @Get()
    getAccounts(): Promise<AccountEntity[]> {
        return this.accountService.findAll();
    }

    @Post('/register')
    async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
        const cookies = Object.keys(req.cookies).map(
            (key) => `${key}=${req.cookies[key]}`,
        );
        const cookiesString = cookies.join(';');

        const { cardId, referrerCode } = registerDto.myData;

        const refererId = referrerCode ? parseInt(referrerCode) : null;

        if (refererId && isNaN(refererId)) {
            throw new HttpException(
                'Mã giới thiệu không chính xác',
                HttpStatus.BAD_REQUEST,
            );
        }

        let referer = null;

        if (refererId) {
            referer = await this.accountService.findOne(refererId);
            if (!referer) {
                throw new HttpException(
                    'Mã giới thiệu không chính xác',
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        try {
            const regRes = await this.kratosService.register(
                registerDto.flowId,
                registerDto.data,
                cookiesString,
            );

            const oryId = regRes.data.identity.id;

            const newAccount = await this.accountService.create({
                ory_id: oryId,
                referer,
                email: regRes.data.identity.traits.email,
            });

            const card = await this.cardService.connectCardWithAccount({
                account_id: newAccount.id,
                card_id: cardId,
            });

            // khi đăng ký thành công, chưa thưởng vội

            // if (refererId) {
            //     await this.referralService.rewardCardReferer(
            //         refererId,
            //         newAccount.id,
            //     );
            // }

            // Reward user 300k -> vi phu chi khi la CTV
            // await this.secondaryTransactionService.create({
            //     account_id: newAccount.id,
            //     amount: 300000,
            // });

            return new ResponseDto(regRes.data, true);
        } catch (err) {
            if (err.response) {
                if (err.response.data.error) {
                    throw new HttpException(
                        err.response.data.error.message,
                        err.response.data.error.code,
                    );
                } else {
                    throw new HttpException(
                        err.response.data,
                        HttpStatus.BAD_REQUEST,
                    );
                }
                // console.log(err.response.data)
            } else {
                console.log(err);
                throw new Error();
            }
        }
    }

    @Get('/get-tree/:referer_id')
    async getTree(@Param('referer_id') referer_id) {
        const referer = await this.accountService.findOne(referer_id);

        if (!referer) {
            throw new HttpException(
                'Mã giới thiệu không chính xác',
                HttpStatus.BAD_REQUEST,
            );
        }
        const ancestors = await this.dataSource.manager
            .getTreeRepository(AccountEntity)
            .createAncestorsQueryBuilder('account', 'accountClosure', referer)
            .leftJoinAndSelect('account.agency', 'agency')
            .orderBy('account.referer_id', 'DESC')
            .getMany();
        if (ancestors.length > 1) {
            this.helperService.swapArray(ancestors, 0, ancestors.length - 1);
        }
        return ancestors;
    }

    @Get('/decendants/:account_id')
    async getDecendants(@Param('account_id') _account_id) {
        const account_id = parseInt(_account_id)
        const decendants = await this.accountService.getDescendants(account_id);

        return decendants;
    }
}
