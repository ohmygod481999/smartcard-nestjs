import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorController } from './vendor.controller';
import { VendorEntity } from './vendor.entity';
import { VendorService } from './vendor.service';

@Module({
    imports: [TypeOrmModule.forFeature([VendorEntity])],
    controllers: [VendorController],
    providers: [VendorService],
    exports: [VendorService]
})
export class VendorModule {}
