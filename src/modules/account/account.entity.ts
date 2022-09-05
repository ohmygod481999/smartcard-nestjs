import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
    UpdateDateColumn,
} from 'typeorm';
import { AccountInfoEntity } from '../account-info/account-info.entity';
import { AgencyEntity } from '../agency/agency.entity';
import { ResumeEntity } from '../resume/resume.entity';
import { VendorEntity } from '../vendor/vendor.entity';

@Entity('account')
@Tree('materialized-path')
export class AccountEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        type: 'uuid',
        nullable: false,
    })
    public ory_id: string;

    @Column({
        default: false,
    })
    is_root: boolean;

    @Column({
        nullable: false,
    })
    email: string;

    @Column({
        nullable: true,
    })
    referer_id: number;

    @Column({
        nullable: true,
    })
    account_info_id: number;

    @OneToOne(() => AccountInfoEntity, (account_info) => account_info.account)
    @JoinColumn({
        name: 'account_info_id',
    })
    account_info: AccountInfoEntity;

    @OneToOne(() => ResumeEntity, (resume) => resume.account)
    resume: ResumeEntity;

    @OneToOne(() => AgencyEntity, (agency) => agency.account)
    agency: AgencyEntity;

    // @OneToOne(() => VendorEntity, (vendor) => vendor.account)
    // vendor: VendorEntity;

    // @ManyToOne(() => AccountEntity, (account) => account.referee)
    // @JoinColumn({
    //     name: 'referer_id',
    // })
    @TreeParent()
    referer: AccountEntity;

    @OneToMany((type) => AccountEntity, (account) => account.referer)
    @TreeChildren()
    referee: AccountEntity[];

    // @Column({
    //     default: false,
    //     nullable: false,
    // })
    // is_agency: Boolean;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        // default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public created_at: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        // default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    public updated_at: Date;
}
