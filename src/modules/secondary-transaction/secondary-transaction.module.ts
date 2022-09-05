import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecondaryTransactionEntity } from './secondary-transaction.entity';
import { SecondaryTransactionService } from './secondary-transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([SecondaryTransactionEntity])],
  providers: [SecondaryTransactionService],
  controllers: [],
  exports: [SecondaryTransactionService]
})
export class SecondaryTransactionModule {}