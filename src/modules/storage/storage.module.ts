import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountInfoModule } from '../account-info/account-info.module';
import { AccountModule } from '../account/account.module';
import { ReferralModule } from '../referral/referral.module';
import { SecondaryTransactionModule } from '../secondary-transaction/secondary-transaction.module';
import { TransactionModule } from '../transaction/transaction.module';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
    imports: [AccountModule, TransactionModule, ReferralModule, SecondaryTransactionModule, AccountInfoModule],
    providers: [StorageService],
    controllers: [StorageController],
    exports: [StorageService]
})
export class StorageModule {}
