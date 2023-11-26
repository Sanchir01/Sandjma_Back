import { Module } from '@nestjs/common';
import { ProductColorService } from './product-color.service';
import { ProductColorResolver } from './product-color.resolver';

@Module({
  providers: [ProductColorResolver, ProductColorService]
})
export class ProductColorModule {}
