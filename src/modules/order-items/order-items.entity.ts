import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AccountEntity } from '../account/account.entity';
import { OrderEntity } from '../order/order.entity';
import { ProductEntity } from '../product/product.entity';

@Entity('order_items')
export class OrderItemsEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: String;

    @Column({
        nullable: false,
    })
    order_id: string;

    @ManyToOne(() => OrderEntity, order => order.order_items)
    @JoinColumn({
        name: 'order_id',
    })
    order: OrderEntity;

    @Column({
        nullable: false,
    })
    product_id: number;

    @ManyToOne(() => ProductEntity)
    @JoinColumn({
        name: 'product_id',
    })
    product: ProductEntity;

    @Column({
        type: 'int',
    })
    quantity: number;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        // default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    public updated_at: Date;
}
