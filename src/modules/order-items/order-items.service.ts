import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from 'src/shared/services/helper.service';
import { DataSource, Repository } from 'typeorm';
import { AccountEntity } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import { SecondaryTransactionService } from '../secondary-transaction/secondary-transaction.service';
import {
    TransactionSourceType,
    TransactionStatusEnum,
    TransactionTargetType,
    TransactionTypeEnum,
} from '../transaction/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { CreateOrderItemDto } from './dto/createOrderItemDto';
import { OrderItemsEntity } from './order-items.entity';

@Injectable()
export class OrderItemsService {
    constructor(
        @InjectRepository(OrderItemsEntity)
        private orderItemsRepository: Repository<OrderItemsEntity>,
    ) {}

    async createOrderItems(
        createOrderItemsDto: CreateOrderItemDto,
    ): Promise<OrderItemsEntity[]> {
        console.log(createOrderItemsDto)
        const orderItemsInsert = await this.orderItemsRepository.insert(
            createOrderItemsDto.order_items.map(order_item => ({
                ...order_item,
                order_id: createOrderItemsDto.order_id
            })),
        );

        return orderItemsInsert.raw;
    }
}
