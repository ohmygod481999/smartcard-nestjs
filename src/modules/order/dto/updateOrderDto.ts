import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatusEnum } from '../order.entity';

export class UpdateOrderDto {
    @IsEnum(OrderStatusEnum)
    status?: OrderStatusEnum;
}
