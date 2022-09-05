import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralService } from './referral.service';
import { ReferralEntity } from './referral.entity';
import { AccountModule } from '../account/account.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReferralEntity]),
        // AccountModule,
        forwardRef(() => AccountModule),
        TransactionModule,
    ],
    providers: [ReferralService],
    controllers: [],
    exports: [ReferralService],
})
export class ReferralModule {}
