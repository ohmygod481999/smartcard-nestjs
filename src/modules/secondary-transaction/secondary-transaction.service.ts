import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSecondaryTransactionDto } from './dto copy/createTransactionDto';
import { SecondaryTransactionEntity, SecondaryTransactionType } from './secondary-transaction.entity';

@Injectable()
export class SecondaryTransactionService {
    constructor(
        @InjectRepository(SecondaryTransactionEntity)
        private transactionRepository: Repository<SecondaryTransactionEntity>,
    ) {}

    findAll(): Promise<SecondaryTransactionEntity[]> {
        return this.transactionRepository.find();
    }

    findOne(id: string): Promise<SecondaryTransactionEntity> {
        return this.transactionRepository.findOneBy({ id });
    }

    findByAccountId(account_id): Promise<SecondaryTransactionEntity[]> {
        return this.transactionRepository.find({
            where: {
                account_id,
            },
        });
    }

    async create(
        createSecondaryTransactionDto: CreateSecondaryTransactionDto,
    ): Promise<SecondaryTransactionEntity> {
        const newTransaction: SecondaryTransactionEntity =
            SecondaryTransactionEntity.create();

        newTransaction.account_id = createSecondaryTransactionDto.account_id;
        newTransaction.amount = createSecondaryTransactionDto.amount;
        newTransaction.type = SecondaryTransactionType.DEFAULT

        await newTransaction.save();

        return newTransaction;
    }
}
