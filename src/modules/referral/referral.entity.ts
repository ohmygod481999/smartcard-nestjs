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
import { AgencyEntity } from '../agency/agency.entity';
import { TransactionEntity } from '../transaction/transaction.entity';

export enum ReferralTypeEnum {
    CARD = 'card',
    AGENCY = 'agency',
}

@Entity('referral')
export class ReferralEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        nullable: false,
    })
    level: number;

    @Column({
        type: 'enum',
        enum: ReferralTypeEnum,
    })
    type: ReferralTypeEnum;

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
    target_agency_id: string;

    @ManyToOne(() => AgencyEntity)
    @JoinColumn({
        name: 'target_agency_id',
    })
    target_agency: AgencyEntity;

    @Column({
        nullable: false,
    })
    referer_id: number;

    @ManyToOne(() => AccountEntity)
    @JoinColumn({
        name: 'referer_id',
    })
    referer: AccountEntity;

    @Column({
        nullable: false,
    })
    referee_id: number;

    @ManyToOne(() => AccountEntity)
    @JoinColumn({
        name: 'referee_id',
    })
    referee: AccountEntity;

    @Column({
        nullable: false,
    })
    transaction_id: string;

    @OneToOne(() => TransactionEntity)
    @JoinColumn({
        name: 'transaction_id',
    })
    transaction: TransactionEntity;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public created_at: Date;
}
