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

@Entity("account_info")
export class AccountInfoEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    public id: number;

    @OneToOne(() => AccountEntity, (account) => account.account_info)
    // @JoinColumn({
    //     name: 'account_id',
    // })
    account: AccountEntity;

    @Column({
        nullable: true
    })
    name: String;

    @Column({
        nullable: true
    })
    phone: String;
    
    @Column({
        nullable: true
    })
    description: String;

    @Column({
        nullable: true
    })
    email: String;

    @Column({
        nullable: true
    })
    avatar: String;

    @Column({
        nullable: true
    })
    facebook: String;

    @Column({
        nullable: true
    })
    zalo: String;

    @Column({
        nullable: true
    })
    slide_text: String;

    @Column({
        nullable: true
    })
    website: String;

    @Column({
        nullable: true
    })
    bank_name: String;

    @Column({
        nullable: true
    })
    bank_number: String;

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
