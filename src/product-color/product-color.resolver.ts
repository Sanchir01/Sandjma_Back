import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/decorators/auth.decorator'
import { ProductColorInput } from './dto/CreateProductColor.input'
import { ProductColor } from './entities/productColor.entity'
import { ProductColorService } from './product-color.service'

@Resolver()
export class ProductColorResolver {
	constructor(private readonly productColorService: ProductColorService) {}

	@Query(() => [ProductColor])
	async getAllProduct() {
		return this.productColorService.GetAllProductColor()
	}

	@Mutation(() => ProductColor)
	@Auth()
	async createProductColor(
		@Args('productColorInput') productColorInput: ProductColorInput
	) {
		return this.productColorService.createProductColor(productColorInput)
	}

	@Mutation(() => ProductColor)
	@Auth()
	async updateProductColor(
		@Args('productColorInput') productColorInput: ProductColorInput
	) {
		return this.productColorService.updateProductColor(productColorInput)
	}

	@Mutation(() => ProductColor)
	@Auth()
	async deleteProductColor(@Args('productColorInput') productColorInput: ProductColorInput) {
		return this.productColorService.deleteProductColor(productColorInput)
	}
}
