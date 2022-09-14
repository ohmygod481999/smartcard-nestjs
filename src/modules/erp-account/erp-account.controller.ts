import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ResponseDto } from 'src/shared/dto/responseDto';
import { ApproveErpDto } from './dto/arrpoveErpDto';
import { RegisterErpExistCompanyDto, RegisterErpNewCompanyDto } from './dto/registerErpDto';
import { ErpAccountService } from './erp-account.service';

@Controller('erp')
export class ErpAccountController {
    constructor(
        private readonly erpAccountService: ErpAccountService,
    ) {}

    @Post('/register-new-company')
    async registerNewCompany(
        @Body() registerErpNewCompanyDto: RegisterErpNewCompanyDto,
        @Req() req: Request,
    ) {
        const erpAcocunt = await this.erpAccountService.registerNewCompany(
            registerErpNewCompanyDto.account_id,
            registerErpNewCompanyDto.company_name
        );
        return new ResponseDto(erpAcocunt, true, 'Thành công');
    }

    @Post('/register-exist-company')
    async registerExistCompany(
        @Body() registerErpExistCompanyDto: RegisterErpExistCompanyDto,
        @Req() req: Request,
    ) {
        const erpAcocunt = await this.erpAccountService.registerExistCompany(
            registerErpExistCompanyDto.account_id,
            registerErpExistCompanyDto.company_id
        );
        return new ResponseDto(erpAcocunt, true, 'Thành công');
    }

    @Post('/approve')
    async approve(@Body() approveErpDto: ApproveErpDto) {
        const erpAcocunt = await this.erpAccountService.approve(approveErpDto.erp_account_id)
        return new ResponseDto(erpAcocunt, true, 'Thành công');
    }
}
