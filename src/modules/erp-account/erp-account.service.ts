import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from 'src/shared/services/helper.service';
import { DataSource, Repository } from 'typeorm';
import { AccountEntity } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import { OrderItemsEntity } from '../order-items/order-items.entity';
import { OrderItemsService } from '../order-items/order-items.service';
import { SecondaryTransactionService } from '../secondary-transaction/secondary-transaction.service';
import {
    TransactionSourceType,
    TransactionStatusEnum,
    TransactionTargetType,
    TransactionTypeEnum,
} from '../transaction/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { ErpAccountEntity, ErpAccountStatus } from './erp-account.entity';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class ErpAccountService {
    constructor(
        @InjectRepository(ErpAccountEntity)
        private readonly erpAccountRepository: Repository<ErpAccountEntity>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly accountService: AccountService,
    ) {}

    public async registerNewCompany(
        account_id: number,
        company_name: string,
    ): Promise<ErpAccountEntity> {
        if (!account_id || !company_name) {
            throw new HttpException(
                'account_id or company not found',
                HttpStatus.BAD_REQUEST,
            );
        }
        const existErpAccount = await this.erpAccountRepository.findOne({
            where: {
                account_id,
            },
        });

        if (existErpAccount) {
            throw new HttpException(
                'Tài khoản đã đăng ký',
                HttpStatus.BAD_REQUEST,
            );
        }

        // register
        const erpAccount = await ErpAccountEntity.create({
            account_id,
            status: ErpAccountStatus.CREATED,
            company_name,
        });
        await erpAccount.save();
        // const erpAccount = await this.erpAccountRepository.create({
        //     account_id,
        //     status: ErpAccountStatus.CREATED,
        //     company_name,
        // });

        return erpAccount;
    }

    public async registerExistCompany(
        account_id: number,
        company_id: number,
    ): Promise<ErpAccountEntity> {
        if (!account_id || !company_id) {
            throw new HttpException(
                'account_id or company not found',
                HttpStatus.BAD_REQUEST,
            );
        }
        const existErpAccount = await this.erpAccountRepository.findOne({
            where: {
                account_id,
            },
        });

        if (existErpAccount) {
            throw new HttpException(
                'Tài khoản đã đăng ký',
                HttpStatus.BAD_REQUEST,
            );
        }

        // register

        const erpAccount = await ErpAccountEntity.create({
            account_id,
            status: ErpAccountStatus.CREATED,
            company_id,
        });
        await erpAccount.save();

        // const erpAccount = await this.erpAccountRepository.create({
        //     account_id,
        //     status: ErpAccountStatus.CREATED,
        //     company_id,
        // });

        return erpAccount;
    }

    public async approve(erp_account_id: number): Promise<ErpAccountEntity> {
        const erpAccount = await this.erpAccountRepository.findOne({
            where: {
                id: erp_account_id,
            },
        });

        if (!erpAccount) {
            throw new HttpException(
                'Mã đăng ký không tồn tại',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (erpAccount.status === ErpAccountStatus.APPROVED) {
            throw new HttpException(
                'Mã này đã đăng ký thành công',
                HttpStatus.BAD_REQUEST,
            );
        }

        // call api register erp
        const erpUrl = this.configService.get('ERP_URL');

        const account = await this.accountService.findOne(
            erpAccount.account_id,
        );

        if (!account)
            throw new HttpException(
                'Account not found',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );

        // new Company
        if (erpAccount.company_name) {
            const res = await this.httpService.axiosRef.post(
                `${erpUrl}/oauth/register_new_account`,
                {
                    company_name: erpAccount.company_name,
                    ory_id: account.ory_id,
                },
            );
            console.log('register_new_account', res);
        }
        // exist company
        else if (erpAccount.company_id) {
            // register_new_account_exist_company
            const res = await this.httpService.axiosRef.post(
                `${erpUrl}/oauth/register_new_account_exist_company`,
                {
                    company_id: erpAccount.company_id,
                    ory_id: account.ory_id,
                },
            );

            console.log('register_new_account_exist_company', res);
        }

        // update status
        erpAccount.status = ErpAccountStatus.APPROVED;
        await erpAccount.save();

        return erpAccount;
    }
}
