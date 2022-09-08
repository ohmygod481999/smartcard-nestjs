import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common';
import { ResponseDto } from 'src/shared/dto/responseDto';
import { AccountService } from '../account/account.service';
import { ReferralService } from '../referral/referral.service';
import {
    AgencyRegisterEntity,
    AgencyRegisterStatus,
} from './agency-register.entity';
import { AgencyEntity, AgencyType } from './agency.entity';
import { AgencyService } from './agency.service';
import { AcceptAgencyDto } from './dto/acceptAgencyDto';
import { CreateAgencyDto } from './dto/createAgencyDto';
import { RegisterAgencyDto } from './dto/registerAgencyDto';

@Controller('agency')
export class AgencyController {
    constructor(
        private readonly agencyService: AgencyService,
        private readonly referalService: ReferralService,
        private readonly accountService: AccountService,
    ) {}

    @Get()
    getAgencys(): Promise<AgencyEntity[]> {
        return this.agencyService.findAll();
    }

    @Get(':id')
    getAgency(@Param() params): Promise<AgencyRegisterEntity> {
        return this.agencyService.findAgencyRegisterOne({
            id: parseInt(params.id),
        });
    }

    @Post('/accept')
    async accept(@Body() acceptAgencyDto: AcceptAgencyDto) {
        const agencyRegister = await this.agencyService.findAgencyRegisterOne({
            id: acceptAgencyDto.agency_register_id,
        });

        console.log(agencyRegister)

        if (!agencyRegister) {
            throw new HttpException(
                'Mã đăng ký không hợp lệ',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (agencyRegister.status !== AgencyRegisterStatus.CREATED) {
            throw new HttpException(
                'Mã đăng ký đã xử lý rồi',
                HttpStatus.BAD_REQUEST,
            );
        }

        const referee = await this.accountService.findOne(
            agencyRegister.account_id,
        );

        if (!referee) {
            throw new HttpException(
                'Mã tài khoản không hợp lệ',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (acceptAgencyDto.accept === true) {
            const agency = await this.agencyService.create({
                account_id: agencyRegister.account_id,
                type: agencyRegister.type,
            });

            // Đồng ý làm đại lý or CTV
            this.agencyService.updateStatusAgencyRegister(
                acceptAgencyDto.agency_register_id,
                AgencyRegisterStatus.ACCEPTED,
            );

            // Nếu có người giới thiệu bên trên
            if (referee.referer) {
                await this.referalService.rewardAgencyReferer(
                    referee.referer.id,
                    referee.id,
                    agencyRegister.type,
                );
                // if (agencyRegister.type === AgencyType.AGENCY) {
                // }
            }
            return new ResponseDto(agency, true);
        } else {
            this.agencyService.updateStatusAgencyRegister(
                acceptAgencyDto.agency_register_id,
                AgencyRegisterStatus.REFUSED,
            );
            return new ResponseDto({}, true, 'Đã từ chối');
        }
    }

    @Post('/register')
    async register(@Body() registerAgencyDto: RegisterAgencyDto) {
        const agencyRegister = this.agencyService.register(registerAgencyDto);

        return agencyRegister;
    }
}
