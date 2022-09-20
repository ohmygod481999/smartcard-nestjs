import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configurations';
import { DatabaseModule } from './modules/database/database.module';
import { AccountModule } from './modules/account/account.module';
import { AccountInfoModule } from './modules/account-info/account-info.module';
import { CardModule } from './modules/card/card.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { SecondaryTransactionModule } from './modules/secondary-transaction/secondary-transaction.module';
import { WithdrawalModule } from './modules/withdrawal/withdrawal.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { SharedModule } from './shared/shared.module';
import { ReferralModule } from './modules/referral/referral.module';
import { AgencyModule } from './modules/agency/agency.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { StorageModule } from './modules/storage/storage.module';
import { ResumeModule } from './modules/resume/resume.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { BillInfoModule } from './modules/bill-info/bill-info.module';
import { ErpAccountModule } from './modules/erp-account/erp-account.module';
import { RechargeRegisterModule } from './modules/recharge-register/recharge-register.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),
        SharedModule,
        DatabaseModule,
        AccountInfoModule,
        CardModule,
        AccountModule,
        TransactionModule,
        SecondaryTransactionModule,
        WithdrawalModule,
        ProductModule,
        OrderModule,
        OrderItemsModule,
        ReferralModule,
        AgencyModule,
        WalletModule,
        StorageModule,
        ResumeModule,
        VendorModule,
        BillInfoModule,
        ErpAccountModule,
        RechargeRegisterModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
