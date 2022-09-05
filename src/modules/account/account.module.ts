import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountInfoModule } from '../account-info/account-info.module';
import { CardModule } from '../card/card.module';
import { ReferralModule } from '../referral/referral.module';
import { SecondaryTransactionModule } from '../secondary-transaction/secondary-transaction.module';
import { TransactionModule } from '../transaction/transaction.module';
import { AccountController } from './account.controller';
import { AccountEntity } from './account.entity';
import { AccountService } from './account.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([AccountEntity]),
        CardModule,
        TransactionModule,
        AccountInfoModule,
        forwardRef(() => ReferralModule),
        SecondaryTransactionModule
        // ReferralModule
    ],
    providers: [AccountService],
    controllers: [AccountController],
    exports: [AccountService]
})
export class AccountModule {}
