import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RechargeRegisterEntity, RechargeRegisterStatus } from './recharge-register.entity';


@Injectable()
export class RechargeRegisterService {
    constructor(
        @InjectRepository(RechargeRegisterEntity)
        private readonly rechargeRegisterRepository: Repository<RechargeRegisterEntity>,
    ) {}

    public async find(recharge_register_id: number): Promise<RechargeRegisterEntity> {
        const rechargeRegister = await this.rechargeRegisterRepository.findOne({
            where: {
                id: recharge_register_id,
            },
        });

        if (!rechargeRegister) {
            throw new HttpException(
                'Mã đăng ký không tồn tại',
                HttpStatus.BAD_REQUEST,
            );
        }

        return rechargeRegister;
    }
}
