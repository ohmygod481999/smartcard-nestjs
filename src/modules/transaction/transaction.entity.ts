import {
    BaseEntity,
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
import { VendorEntity } from '../vendor/vendor.entity';

export enum TransactionStatusEnum {
    SUCCESS = 'success',
    FAILED = 'failed',
}

export enum TransactionTypeEnum {
    REWARD_REFER = 'reward-refer',
    REWARD_REFER_AGENCY = 'reward-refer-agency',
    TRANSFER = 'transfer',
    PAYMENT = 'payment',
    WITHDRAW = 'withdraw',
    RECHARGE = 'recharge',
}

export enum TransactionSourceType {
    ACCOUNT = 'account',
    SYSTEM = 'system',
}

export enum TransactionTargetType {
    ACCOUNT = 'account',
    SYSTEM = 'system',
    WITHDRAW = 'withdraw',
}

@Entity('transaction')
export class TransactionEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        type: 'enum',
        enum: TransactionStatusEnum,
        nullable: false,
    })
    status: TransactionStatusEnum;

    @Column({
        type: 'enum',
        enum: TransactionTypeEnum,
        nullable: false,
    })
    type: TransactionTypeEnum;

    @Column({
        nullable: true,
    })
    source_id: number;

    @ManyToOne(() => AccountEntity)
    @JoinColumn({
        name: 'source_id',
    })
    source: AccountEntity;

    @Column({
        nullable: true,
    })
    target_id: number;

    @ManyToOne(() => AccountEntity)
    @JoinColumn({
        name: 'target_id',
    })
    target: AccountEntity;

    @Column({
        nullable: true,
    })
    vendor_id: number;

    @ManyToOne(() => VendorEntity)
    @JoinColumn({
        name: 'vendor_id',
    })
    vendor: VendorEntity;

    @Column({
        nullable: true,
    })
    order_id: String;

    // amount
    @Column({
        type: 'float4',
    })
    amount: number;

    // note
    @Column({
        nullable: true
    })
    note: string;

    // Date
    @CreateDateColumn({
        type: 'timestamp with time zone',
        // default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        // default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    public updated_at: Date;
}
