import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from 'src/shared/services/helper.service';
import { DataSource, Repository } from 'typeorm';
import { AccountInfoService } from '../account-info/account-info.service';
import { AccountEntity } from './account.entity';
import { CreateAccountDto } from './dto/CreateAccountDto';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(AccountEntity)
        private accountRepository: Repository<AccountEntity>,
        private dataSource: DataSource,
        private accountInfoService: AccountInfoService,
        private readonly helperService: HelperService,
        public configService: ConfigService,
    ) {}

    findAll(): Promise<AccountEntity[]> {
        return this.accountRepository.find();
    }

    async findMaxId(): Promise<number> {
        const max = await this.accountRepository
            .createQueryBuilder('account')
            .select('MAX(account.id)', 'max')
            .execute();
        return max[0].max;
    }

    findOne(id: number): Promise<AccountEntity> {
        return this.accountRepository
            .createQueryBuilder('account')
            .where({
                id,
            })
            .leftJoinAndSelect('account.referer', 'referer')
            .leftJoinAndSelect('account.agency', 'agency')
            .getOne();

        // return this.accountRepository.findOneBy({ id });
    }

    findOneByOryId(ory_id: string): Promise<AccountEntity> {
        return (
            this.accountRepository
                .createQueryBuilder('account')
                .where({
                    ory_id,
                })
                // .leftJoinAndSelect('account.referer', 'referer')
                .getOne()
        );

        // return this.accountRepository.findOneBy({ id });
    }

    async create(createAccountDto: CreateAccountDto): Promise<AccountEntity> {
        const account_info = await this.accountInfoService.create({});

        const account: AccountEntity = AccountEntity.create();
        const maxId = await this.findMaxId();
        account.id = maxId + 1;
        account.ory_id = createAccountDto.ory_id;
        account.email = createAccountDto.email;
        if (createAccountDto.referer) {
            account.referer = createAccountDto.referer;
        }
        account.account_info = account_info;

        await account.save();

        return account;
    }

    async remove(id: number): Promise<void> {
        await this.accountRepository.delete(id);
    }

    async getAncestors(account_id: number): Promise<AccountEntity[]> {
        const referer = await this.findOne(account_id);

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

    async getDescendants(account_id: number): Promise<AccountEntity[]> {
        const account = await this.findOne(account_id);

        if (!account) {
            throw new HttpException(
                'Mã giới thiệu không chính xác',
                HttpStatus.BAD_REQUEST,
            );
        }

        const descendants = await this.dataSource.manager.query(`
        with recursive temp_table as (
            select
                account.id as id,
                account.referer_id as referer_id,
                account.email as email,
                a1.id as agency_id,
                a1.join_at as join_at,
                a1.type as type
            from account
            left join agency a1 on account.id = a1.account_id
            where
                account.id = ${account_id}
            union
                select
                    a.id as id,
                    a.referer_id as referer_id,
                    a.email as email,
                    a2.id as agency_id,
                    a2.join_at as join_at,
                    a2.type as type
                from
                    account a
                left join agency a2 on a.id = a2.account_id
                inner join temp_table s on s.id = a.referer_id
        ) select * from temp_table 
        `);

        console.log(descendants);
        // .getTreeRepository(AccountEntity)
        // .createDescendantsQueryBuilder('account', 'accountClosure', account)
        // .leftJoinAndSelect('account.agency', 'agency')
        // // .orderBy('account.mpath', 'ASC')
        // .getMany();

        // if (descendants.length > 1 && descendants[descendants.length - 1].id === account_id) {
        //     // descendants.splice(descendants.length - 1, 1)
        //     this.helperService.swapArray(descendants, descendants.length - 1, 0);
        // }
        // console.log(descendants)
        return descendants;
    }

    async getRootAccount(): Promise<AccountEntity> {
        const rootAccounts = await this.accountRepository
            .createQueryBuilder('account')
            .where('is_root = :is_root', {
                is_root: true,
            })
            // .leftJoinAndSelect('account.vendor', 'vendor')
            .getMany();
        // const rootAccounts = await this.accountRepository.findBy({
        //     is_root: true,
        // });

        if (rootAccounts.length !== 1) {
            throw new HttpException(
                'Hệ thống chỉ được có duy nhất 1 root account',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const rootAccount = rootAccounts[0];

        // if (!rootAccount.vendor) {
        //     throw new HttpException(
        //         'Tài khoản root chưa phải là vendor, vui lòng liên hệ với nhà phát triển',
        //         HttpStatus.INTERNAL_SERVER_ERROR,
        //     );
        // }

        return rootAccount;
    }
}
