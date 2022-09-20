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

export enum RechargeRegisterStatus {
    CREATED = 'created',
    ACCEPTED = 'accepted',
    REFUSED = 'refused',
}

@Entity('recharge_register')
export class RechargeRegisterEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        type: 'enum',
        enum: RechargeRegisterStatus,
    })
    status: RechargeRegisterStatus;

    @Column()
    account_id: number;

    @ManyToOne(() => AccountEntity)
    @JoinColumn({
        name: 'account_id',
    })
    account: AccountEntity;

    @Column()
    amount: number;

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
