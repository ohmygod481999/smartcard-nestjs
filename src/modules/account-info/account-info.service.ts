import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountInfoEntity } from './account-info.entity';
import { CreateAccountInfoDto } from './dto/createAccountInfoDto';

@Injectable()
export class AccountInfoService {
    constructor(
        @InjectRepository(AccountInfoEntity)
        private accountInfoRepository: Repository<AccountInfoEntity>,
    ) {}

    findAll(): Promise<AccountInfoEntity[]> {
        return this.accountInfoRepository.find();
    }

    findOne(id: number): Promise<AccountInfoEntity> {
        return this.accountInfoRepository.findOneBy({ id });
    }

    async findOneByAccountId(account_id: number): Promise<AccountInfoEntity> {
        // console.log(await this.accountInfoRepository
        //     .createQueryBuilder('account_info')
        //     .leftJoin('account_info.account', 'account')
        //     .where('account.id = :account_id')
        //     .setParameters({
        //         account_id,
        //     })
        //     .getSql())

        return this.accountInfoRepository
            .createQueryBuilder('account_info')
            // .leftJoin('account_info.account', 'account')
            .leftJoinAndSelect("account_info.account", "account")
            .where('account.id = :account_id')
            .setParameters({
                account_id,
            })
            .getOne();
    }

    async create(
        createAccountInfoDto: CreateAccountInfoDto,
    ): Promise<AccountInfoEntity> {
        const newAccountInfo: AccountInfoEntity =
            AccountInfoEntity.create(createAccountInfoDto);

        await newAccountInfo.save();

        return newAccountInfo;
    }

    async remove(account_id: number): Promise<void> {
        await this.accountInfoRepository.delete(account_id);
    }
}
