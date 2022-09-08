import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AccountEntity } from '../account/account.entity';

export enum AgencyType {
    AGENCY = 'agency',
    COLABORATOR = 'colaborator',
}

@Entity('agency')
export class AgencyEntity extends BaseEntity {
    @PrimaryColumn()
    public id: string;

    @Column({
        enum: AgencyType,
        default: AgencyType.AGENCY
    })
    type: AgencyType


    @Column({
        nullable: false,
    })
    account_id: number;

    // @OneToOne(() => AccountEntity)
    @OneToOne(() => AccountEntity, (account) => account.agency)
    @JoinColumn({
        name: 'account_id',
    })
    account: AccountEntity;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public join_at: Date;
}
