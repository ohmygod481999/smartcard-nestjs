import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from '../transaction/transaction.module';
import { WalletModule } from '../wallet/wallet.module';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalEntity } from './withdrawal.entity';
import { WithdrawalService } from './withdrawal.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([WithdrawalEntity]),
        TransactionModule,
        WalletModule,
    ],
    providers: [WithdrawalService],
    controllers: [WithdrawalController],
})
export class WithdrawalModule {}
