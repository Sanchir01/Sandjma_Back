import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthAdmin } from 'src/decorators/auth.decorator'
import { ProductColorInput } from './dto/CreateProductColor.input'
import { ProductColor } from './entities/productColor.entity'
import { ProductColorService } from './product-color.service'

@Resolver()
export class ProductColorResolver {
	constructor(private readonly productColorService: ProductColorService) {}

	@Query(() => [ProductColor])
	async getAllProductColor() {
		return this.productColorService.GetAllProductColor()
	}

	@Mutation(() => ProductColor)
	@AuthAdmin('admin')
	async createProductColor(
		@Args('productColorInput') productColorInput: ProductColorInput
	) {
		return this.productColorService.createProductColor(productColorInput)
	}

	@Mutation(() => ProductColor)
	@AuthAdmin('admin')
	async updateProductColor(
		@Args('productColorInput') productColorInput: ProductColorInput
	) {
		return this.productColorService.updateProductColor(productColorInput)
	}

	@Mutation(() => ProductColor)
	@AuthAdmin('admin')
	async deleteProductColor(
		@Args('productColorInput') productColorInput: ProductColorInput
	) {
		return this.productColorService.deleteProductColor(productColorInput)
	}
}
