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

export enum WithdrawalStatus {
    CREATED = 'created',
    PENDING = 'pending',
    SUCCESS = 'success',
}

@Entity('withdrawal')
export class WithdrawalEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        type: 'enum',
        enum: WithdrawalStatus,
    })
    status: WithdrawalStatus;

    @Column({
        nullable: false,
    })
    account_id: number;

    @ManyToOne(() => AccountEntity)
    @JoinColumn({
        name: 'account_id',
    })
    account: AccountEntity;

    @Column({
        type: 'float4',
        nullable: false,
    })
    amount: number;

    @Column({ type: 'timestamp with time zone', default: null })
    public success_at: Date;

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
