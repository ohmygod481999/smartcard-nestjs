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

@Entity("card")
export class CardEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        nullable: true
    })
    account_id: number

    @OneToOne(() => AccountEntity)
    @JoinColumn({
        name: 'account_id',
    })
    account: AccountEntity;

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
