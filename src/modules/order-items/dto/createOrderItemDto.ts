import { IsNumber, IsString, IsUUID } from "class-validator";
import { OrderItemsEntity } from "../order-items.entity";

export class CreateOrderItemDto {
    order_items: OrderItemsEntity[];

    @IsString()
    order_id: string;
}