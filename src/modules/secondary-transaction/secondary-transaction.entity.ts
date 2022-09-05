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

export enum SecondaryTransactionType {
    DEFAULT = 'default',
}

@Entity('secondary_transaction')
export class SecondaryTransactionEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        type: 'enum',
        enum: SecondaryTransactionType,
    })
    type: SecondaryTransactionType;

    @Column({
        nullable: false,
    })
    account_id: number;

    @ManyToOne(() => AccountEntity)
    @JoinColumn({
        name: 'account_id',
    })
    account: AccountEntity;

    // amount
    @Column({
        type: 'float4',
    })
    amount: number;

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
