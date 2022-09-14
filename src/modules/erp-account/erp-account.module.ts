import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErpAccountEntity } from './erp-account.entity';
import { HttpModule } from '@nestjs/axios';
import { AccountModule } from '../account/account.module';
import { ErpAccountController } from './erp-account.controller';
import { ErpAccountService } from './erp-account.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ErpAccountEntity]),
        HttpModule,
        AccountModule,
    ],
    providers: [ErpAccountService],
    controllers: [ErpAccountController],
})
export class ErpAccountModule {}
