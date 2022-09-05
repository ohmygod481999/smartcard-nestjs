import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResumeDto } from './dto/createResumeDto';
import { ResumeEntity } from './resume.entity';

@Injectable()
export class ResumeService {
    constructor(
        @InjectRepository(ResumeEntity)
        private cardRepository: Repository<ResumeEntity>,
    ) {}

    findAll(): Promise<ResumeEntity[]> {
        return this.cardRepository.find();
    }

    findOne(id: number): Promise<ResumeEntity> {
        return this.cardRepository.findOneBy({ id });
    }

    findOneByAccountId(id: number): Promise<ResumeEntity> {
        return this.cardRepository.findOneBy({
            account_id: id,
        });
    }

    create(createResumeDto: CreateResumeDto) {
        return this.cardRepository.insert(createResumeDto);
    }

    async remove(id: number): Promise<void> {
        await this.cardRepository.delete(id);
    }
}
