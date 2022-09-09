import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillInfoEntity } from './bill-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillInfoEntity])],
  // providers: [AccountInfoService],
  controllers: [],
  // exports: [AccountInfoService]
})
export class BillInfoModule {}