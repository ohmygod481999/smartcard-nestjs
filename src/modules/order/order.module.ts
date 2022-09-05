import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { OrderItemsModule } from '../order-items/order-items.module';
import { ProductModule } from '../product/product.module';
import { SecondaryTransactionModule } from '../secondary-transaction/secondary-transaction.module';
import { TransactionModule } from '../transaction/transaction.module';
import { VendorModule } from '../vendor/vendor.module';
import { WalletModule } from '../wallet/wallet.module';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity]),
        TransactionModule,
        SecondaryTransactionModule,
        AccountModule,
        OrderItemsModule,
        WalletModule,
        ProductModule,
        VendorModule,
    ],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
