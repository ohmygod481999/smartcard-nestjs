import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountInfoModule } from '../account-info/account-info.module';
import { AccountModule } from '../account/account.module';
import { ReferralModule } from '../referral/referral.module';
import { SecondaryTransactionModule } from '../secondary-transaction/secondary-transaction.module';
import { AgencyRegisterEntity } from './agency-register.entity';
import { AgencyController } from './agency.controller';
import { AgencyEntity } from './agency.entity';
import { AgencyService } from './agency.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([AgencyEntity]),
        TypeOrmModule.forFeature([AgencyRegisterEntity]),
        AccountInfoModule,
        AccountModule,
        ReferralModule,
        SecondaryTransactionModule
    ],
    providers: [AgencyService],
    controllers: [AgencyController],
    exports: [AgencyService]
})
export class AgencyModule {}
