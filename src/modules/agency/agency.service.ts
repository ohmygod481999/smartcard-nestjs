import {
    HttpCode,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from 'src/shared/services/helper.service';
import { DataSource, FindOptionsWhere, Not, Repository } from 'typeorm';
import { AccountInfoService } from '../account-info/account-info.service';
import { AccountEntity } from '../account/account.entity';
import { AccountService } from '../account/account.service';
import {
    AgencyRegisterEntity,
    AgencyRegisterStatus,
} from './agency-register.entity';
import { AgencyEntity } from './agency.entity';
import { CreateAgencyDto } from './dto/createAgencyDto';
import { RegisterAgencyDto } from './dto/registerAgencyDto';

@Injectable()
export class AgencyService {
    constructor(
        @InjectRepository(AgencyEntity)
        private agencyRepository: Repository<AgencyEntity>,
        @InjectRepository(AgencyRegisterEntity)
        private agencyRegisterRepository: Repository<AgencyRegisterEntity>,
        private accountService: AccountService,
        private readonly helperService: HelperService,
    ) {}

    findAll(): Promise<AgencyEntity[]> {
        return this.agencyRepository.find();
    }

    findOne(id: string): Promise<AgencyEntity> {
        return this.agencyRepository.findOneBy({ id });
    }

    findAgencyRegisterOne(
        where: FindOptionsWhere<AgencyRegisterEntity>,
    ): Promise<AgencyRegisterEntity> {
        return this.agencyRegisterRepository.findOneBy(where);
    }

    async updateStatusAgencyRegister(id: number, status: AgencyRegisterStatus) {
        const agencyRegister = await this.agencyRegisterRepository.findOneBy({
            id,
        });
        agencyRegister.status = status;
        await agencyRegister.save();
    }

    async create(createAgencyDto: CreateAgencyDto): Promise<AgencyEntity> {
        const account = await this.accountService.findOne(
            createAgencyDto.account_id,
        );

        if (!account) {
            throw new HttpException(
                'Tài khoản không tồn tại',
                HttpStatus.BAD_REQUEST,
            );
        }

        const agency: AgencyEntity = AgencyEntity.create();
        agency.account_id = account.id;
        let agencyId;

        while (true) {
            const newId = this.helperService.generateNanoId();
            const existAgencyWithThisId = await this.findOne(newId);
            if (!existAgencyWithThisId) {
                agencyId = newId;
                break;
            }
        }

        agency.id = agencyId;
        agency.type = createAgencyDto.type;

        await agency.save();

        return agency;
    }

    async register(
        registerAgencyDto: RegisterAgencyDto,
    ): Promise<AgencyRegisterEntity> {
        const existRegister = await this.findAgencyRegisterOne({
            account_id: registerAgencyDto.account_id,
            type: registerAgencyDto.type,
            status: Not(AgencyRegisterStatus.REFUSED),
        });
        if (existRegister) {
            throw new HttpException(
                'Agency đã đăng ký',
                HttpStatus.BAD_REQUEST,
            );
        }
        const agencyRegister: AgencyRegisterEntity =
            AgencyRegisterEntity.create();

        agencyRegister.account_id = registerAgencyDto.account_id;
        agencyRegister.type = registerAgencyDto.type;
        agencyRegister.status = AgencyRegisterStatus.CREATED;

        await agencyRegister.save();

        return agencyRegister;
    }

    async remove(id: number): Promise<void> {
        await this.agencyRepository.delete(id);
    }
}
