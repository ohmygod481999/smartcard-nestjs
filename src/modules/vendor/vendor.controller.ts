import { Body, Controller, Post } from '@nestjs/common';
import { ResponseDto } from 'src/shared/dto/responseDto';
import { CreateVendorDto } from './dto/createVendorDto';
import { VendorService } from './vendor.service';

@Controller('vendor')
export class VendorController {
    constructor(private readonly vendorService: VendorService) {}

    @Post("/create")
    async create(@Body() createVendorDto: CreateVendorDto) {
        const vendor = await this.vendorService.create(createVendorDto);

        return new ResponseDto(vendor, true, "Thành công")
    }
}
