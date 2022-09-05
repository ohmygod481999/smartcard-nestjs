import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/createTransactionDto';
import { TransactionEntity } from './transaction.entity';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(TransactionEntity)
        private transactionRepository: Repository<TransactionEntity>,
    ) {}

    findAll(): Promise<TransactionEntity[]> {
        return this.transactionRepository.find();
    }

    findOne(id: string): Promise<TransactionEntity> {
        return this.transactionRepository.findOneBy({ id });
    }

    findByAccountId(account_id): Promise<TransactionEntity[]> {
        return this.transactionRepository.find({
            where: [
                {
                    target_id: account_id,
                },
                {
                    source_id: account_id,
                },
            ],
        });
    }

    async create(
        createTransactionDto: CreateTransactionDto,
    ): Promise<TransactionEntity> {
        const newTransaction: TransactionEntity = TransactionEntity.create();

        newTransaction.status = createTransactionDto.status;
        newTransaction.source_id = createTransactionDto.source_id;
        newTransaction.target_id = createTransactionDto.target_id;
        newTransaction.amount = createTransactionDto.amount;
        newTransaction.type = createTransactionDto.type;
        
        if (createTransactionDto.vendor_id) {
            newTransaction.vendor_id = createTransactionDto.vendor_id;
        }
        if (createTransactionDto.order_id) {
            newTransaction.order_id = createTransactionDto.order_id;
        }

        await newTransaction.save();

        return newTransaction;
    }
}
