import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AccountEntity } from '../account/account.entity';
import { OrderItemsEntity } from '../order-items/order-items.entity';

export enum OrderStatusEnum {
    CREATED = 'created',
    PAID = 'paid',
    SUCCESS = 'success',
}

export enum OrderShippingType {
    SHIP = 'ship',
    SELF_GET = 'self-get',
}

export enum OrderPaymentType {
    WALLET = 'wallet',
    BANK_TRANSFER = 'bank-transfer',
}

@Entity('order')
export class OrderEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({
        nullable: false,
    })
    agency_id: number;

    @ManyToOne(() => AccountEntity)
    @JoinColumn({
        name: 'agency_id',
    })
    account: AccountEntity;


    @OneToMany(() => OrderItemsEntity, order_items => order_items.order)
    order_items: OrderItemsEntity[];

    @Column({
        type: 'enum',
        enum: OrderStatusEnum,
    })
    status: OrderStatusEnum;

    @Column()
    customer_name: String;

    @Column()
    customer_phone: String;
    
    @Column()
    customer_address: String;

    @Column({
        type: "enum",
        enum: OrderShippingType
    })
    shipping_type: OrderShippingType

    @Column({
        type: "enum",
        enum: OrderPaymentType
    })
    payment_type: OrderPaymentType

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
