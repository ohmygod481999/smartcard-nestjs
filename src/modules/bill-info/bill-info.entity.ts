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

export enum BillInfoType {
    ELECTRIC = 'electric',
}

@Entity('bill_info')
export class BillInfoEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        type: 'enum',
        enum: BillInfoType,
    })
    type: BillInfoType;

    @Column({
        nullable: false,
    })
    account_id: number;

    @ManyToOne(() => AccountEntity)
    // @ManyToOne(() => AccountEntity, (account) => account.account_info)
    @JoinColumn({
        name: 'account_id',
    })
    account: AccountEntity;

    @Column({
        type: 'jsonb',
    })
    payload: any;

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
