import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVendorDto } from './dto/createVendorDto';
import { VendorEntity } from './vendor.entity';

@Injectable()
export class VendorService {
    constructor(
        @InjectRepository(VendorEntity)
        private vendorRepository: Repository<VendorEntity>,
    ) {}

    async create(createVendorDto: CreateVendorDto): Promise<VendorEntity> {
        console.log(createVendorDto);
        const vendor = this.vendorRepository.create(createVendorDto);
        await vendor.save();

        return vendor;
    }

    findById(id: number): Promise<VendorEntity> {
        return this.vendorRepository.findOneBy({
            id,
        });
    }

    async getRootVendor(): Promise<VendorEntity> {
        const rootVendors = await this.vendorRepository
            .createQueryBuilder('vendor')
            .where('is_root = :is_root', {
                is_root: true,
            })
            .getMany();
        if (rootVendors.length !== 1) {
            throw new HttpException(
                'Hệ thống chỉ được có duy nhất 1 root vendor',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const rootVendor = rootVendors[0];

        return rootVendor;
    }
}
