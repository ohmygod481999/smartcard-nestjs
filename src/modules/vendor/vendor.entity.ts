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

@Entity('vendor')
export class VendorEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        nullable: false,
    })
    name: String;

    @Column({
        default: false,
    })
    is_root: boolean;

    // @Column({
    //     nullable: false,
    // })
    // account_id: number;

    // @OneToOne(() => AccountEntity, (account) => account.vendor)
    // @JoinColumn({
    //     name: 'account_id',
    // })
    // account: AccountEntity;

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
