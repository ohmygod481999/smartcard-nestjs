import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountInfoEntity } from './account-info.entity';
import { AccountInfoService } from './account-info.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountInfoEntity])],
  providers: [AccountInfoService],
  controllers: [],
  exports: [AccountInfoService]
})
export class AccountInfoModule {}