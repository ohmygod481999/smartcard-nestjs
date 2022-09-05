import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemsEntity } from './order-items.entity';
import { OrderItemsService } from './order-items.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderItemsEntity])],
    providers: [OrderItemsService],
    controllers: [],
    exports: [OrderItemsService],
})
export class OrderItemsModule {}
