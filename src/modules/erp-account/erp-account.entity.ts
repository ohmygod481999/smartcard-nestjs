import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AccountEntity } from '../account/account.entity';

export enum ErpAccountStatus {
    CREATED = 'created',
    APPROVED = 'approved',
}

@Entity('erp_account')
export class ErpAccountEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        nullable: false,
    })
    account_id: number;

    @OneToOne(() => AccountEntity, (account) => account.resume)
    @JoinColumn({
        name: 'account_id',
    })
    account: AccountEntity;

    @Column({
        nullable: true,
        type: 'uuid',
    })
    erp_id: string;

    @Column({
        nullable: true
    })
    company_name: string;

    @Column({
        nullable: true
    })
    company_id: number;

    @Column({
        type: 'enum',
        enum: ErpAccountStatus,
    })
    status: ErpAccountStatus;

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
