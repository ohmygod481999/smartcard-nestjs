import { IsUUID } from 'class-validator';

export class ApproveOrderDto {
    @IsUUID()
    order_id: string;
}
