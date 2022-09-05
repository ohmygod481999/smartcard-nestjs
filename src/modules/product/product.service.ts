import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,
    ) {}

    find(id: number) {
        return this.productRepository.findOneBy({ id });
    }
}
