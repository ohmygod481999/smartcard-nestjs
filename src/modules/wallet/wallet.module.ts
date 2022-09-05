import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { ReferralModule } from '../referral/referral.module';
import { SecondaryTransactionModule } from '../secondary-transaction/secondary-transaction.module';
import { TransactionModule } from '../transaction/transaction.module';
import { VendorModule } from '../vendor/vendor.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
    imports: [
        AccountModule,
        TransactionModule,
        ReferralModule,
        SecondaryTransactionModule,
        VendorModule,
    ],
    providers: [WalletService],
    controllers: [WalletController],
    exports: [WalletService],
})
export class WalletModule {}
