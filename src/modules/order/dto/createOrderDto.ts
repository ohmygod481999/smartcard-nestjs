import { IsEnum, IsNumber, IsString } from 'class-validator';
import { OrderItemsEntity } from 'src/modules/order-items/order-items.entity';
import {
    OrderPaymentType,
    OrderShippingType,
    OrderStatusEnum,
} from '../order.entity';

export class CreateOrderDto {
    @IsEnum(OrderStatusEnum)
    status: OrderStatusEnum;

    @IsNumber()
    agency_id: number;

    @IsString()
    customer_name: String;

    @IsString()
    customer_phone: String;

    @IsString()
    customer_address: String;

    @IsEnum(OrderShippingType)
    shipping_type: OrderShippingType;

    @IsEnum(OrderPaymentType)
    payment_type: OrderPaymentType;

    order_items: OrderItemsEntity[];
}
