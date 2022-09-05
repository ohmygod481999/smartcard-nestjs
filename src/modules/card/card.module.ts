import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from './card.entity';
import { CardService } from './card.service';

@Module({
  imports: [TypeOrmModule.forFeature([CardEntity])],
  providers: [CardService],
  controllers: [],
  exports: [CardService]
})
export class CardModule {}