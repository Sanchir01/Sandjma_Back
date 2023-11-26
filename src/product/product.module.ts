import { Module } from '@nestjs/common'
import { PaginationService } from 'src/pagination/pagination.service'
import { ProductResolver } from './product.resolver'
import { ProductService } from './product.service'
import { CategoryModule } from 'src/category/category.module'
import { PaginationModule } from 'src/pagination/pagination.module'
import { CategoryService } from 'src/category/category.service'

@Module({
	imports: [PaginationModule, CategoryModule],
	providers: [ProductResolver, ProductService, PaginationService,CategoryService]
})
export class ProductModule {}
