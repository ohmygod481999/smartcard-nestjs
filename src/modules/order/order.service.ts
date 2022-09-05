import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from 'src/shared/services/helper.service';
import { DataSource, Repository } from 'typeorm';
import { AccountEntity } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import { OrderItemsEntity } from '../order-items/order-items.entity';
import { OrderItemsService } from '../order-items/order-items.service';
import { SecondaryTransactionService } from '../secondary-transaction/secondary-transaction.service';
import {
    TransactionSourceType,
    TransactionStatusEnum,
    TransactionTargetType,
    TransactionTypeEnum,
} from '../transaction/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { CreateOrderDto } from './dto/createOrderDto';
import { UpdateOrderDto } from './dto/updateOrderDto';
import { OrderEntity, OrderStatusEnum } from './order.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        private orderRepository: Repository<OrderEntity>,
        private transactionService: TransactionService,
        private secondaryTransactionService: SecondaryTransactionService,
        private accountService: AccountService,
        private orderItemsService: OrderItemsService,
    ) {}

    async findOneById(order_id: string): Promise<OrderEntity> {
        return await this.orderRepository.findOneBy({
            id: order_id,
        });
    }

    async update(order_id: string, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
        const result = await this.orderRepository
            .createQueryBuilder()
            .update(updateOrderDto)
            .where({
                id: order_id,
            })
            .returning('*')
            .execute();
        return result.raw[0];
    }

    async updateOrderStatus(
        order_id: string,
        status: OrderStatusEnum,
    ): Promise<OrderEntity> {
        const order = await this.orderRepository.findOneBy({
            id: order_id,
        });
        order.status = status;
        await order.save();
        return order;
    }

    async createOrder(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
        const account = await this.accountService.findOne(
            createOrderDto.agency_id,
        );

        if (!account) {
            throw new HttpException(
                'Mã tài khoản không hợp lệ',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!account.agency) {
            throw new HttpException(
                'Bạn không thể đặt hàng nếu không phải đại lý',
                HttpStatus.BAD_REQUEST,
            );
        }

        // const orderEntity = OrderEntity.create({
        //     ...createOrderDto,
        //     // status: OrderStatusEnum.CREATED,
        // });

        // const order = await orderEntity.save();
        const order = await this.orderRepository.save(createOrderDto);

        const order_items = await this.orderItemsService.createOrderItems({
            order_id: order.id,
            order_items: createOrderDto.order_items,
        });
        console.log(order_items);
        order.order_items = order_items;
        return order;
    }
}
