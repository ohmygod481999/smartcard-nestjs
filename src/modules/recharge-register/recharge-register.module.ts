import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeRegisterEntity } from './recharge-register.entity';
import { RechargeRegisterService } from './recharge-register.service';

@Module({
    imports: [TypeOrmModule.forFeature([RechargeRegisterEntity])],
    providers: [RechargeRegisterService],
    controllers: [],
    exports: [RechargeRegisterService],
})
export class RechargeRegisterModule {}
