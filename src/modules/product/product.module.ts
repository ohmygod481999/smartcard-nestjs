import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity])],
    providers: [ProductService],
    controllers: [],
    exports: [ProductService],
})
export class ProductModule {}
