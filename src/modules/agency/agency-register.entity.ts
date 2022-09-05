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

export enum AgencyRegisterStatus {
    CREATED = 'created',
    ACCEPTED = 'accepted',
    REFUSED = 'refused',
}

@Entity('agency_register')
export class AgencyRegisterEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        nullable: true,
    })
    account_id: number;

    @ManyToOne(() => AccountEntity)
    @JoinColumn({
        name: 'account_id',
    })
    account: AccountEntity;

    @Column({
        type: 'enum',
        enum: AgencyRegisterStatus,
    })
    status: AgencyRegisterStatus;

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
