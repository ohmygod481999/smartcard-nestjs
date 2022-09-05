import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { AccountEntity } from '../account/account.entity';

@Entity('product')
export class ProductEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    name: String;

    @Column({
        type: 'float4',
    })
    price: number;

    @Column()
    description: String;

    @Column()
    thumbnail: String;

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
