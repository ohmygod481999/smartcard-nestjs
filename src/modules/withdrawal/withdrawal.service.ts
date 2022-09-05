import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWithdrawalDto } from './dto/createWithdrawalDto';
import { WithdrawalEntity, WithdrawalStatus } from './withdrawal.entity';

@Injectable()
export class WithdrawalService {
    constructor(
        @InjectRepository(WithdrawalEntity)
        private withdrawalRepository: Repository<WithdrawalEntity>,
    ) {}

    findAll(): Promise<WithdrawalEntity[]> {
        return this.withdrawalRepository.find();
    }

    findOne(id: string): Promise<WithdrawalEntity> {
        return this.withdrawalRepository.findOneBy({ id });
    }

    async updateStatus(withdrawId: string, status: WithdrawalStatus) {
        const withdraw = await this.withdrawalRepository.findOneBy({
            id: withdrawId,
        });
        withdraw.status = status;
        await withdraw.save();
    }

    findPendingWithdrawal(account_id: number): Promise<WithdrawalEntity> {
        return this.withdrawalRepository
            .createQueryBuilder('withdrawal')
            .where({
                account_id,
            })
            .andWhere({
                status: WithdrawalStatus.PENDING,
            })
            .getOne();
    }

    async create(
        createWithdrawalDto: CreateWithdrawalDto,
    ): Promise<WithdrawalEntity> {
        const withdrawal = await WithdrawalEntity.create();
        withdrawal.account_id = createWithdrawalDto.account_id;
        withdrawal.amount = createWithdrawalDto.amount;
        withdrawal.status = createWithdrawalDto.status;
        return await withdrawal.save();
    }

    async remove(id: number): Promise<void> {
        await this.withdrawalRepository.delete(id);
    }
}
