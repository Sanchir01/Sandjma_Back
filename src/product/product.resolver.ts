import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthAdmin } from 'src/decorators/auth.decorator'
import { CreateProductInput } from './dto/createProduct.input'
import { GetAllProductInput } from './dto/getAllProducts.input'
import { GetProductByColor, GetProductById } from './dto/getProductByIdAndFlug'
import {
	Product,
	ReturnFieldByCreateProduct,
	allProductsAndLength
} from './entities/product.entity'
import { ProductService } from './product.service'

@Resolver()
export class ProductResolver {
	constructor(private readonly productService: ProductService) {}

	@Query(() => allProductsAndLength)
	getAllProducts(
		@Args('getAllProductInput') getAllProductInput: GetAllProductInput
	) {
		return this.productService.getAll(getAllProductInput)
	}

	@Mutation(() => ReturnFieldByCreateProduct)
	@AuthAdmin('admin')
	createProduct(
		@Args('createProductInput') createProductInput: CreateProductInput
	) {
		return this.productService.createProduct(createProductInput)
	}

	@Query(() => Product)
	getProductById(@Args('getProductById') getProductById: GetProductById) {
		return this.productService.getProductById(getProductById.id)
	}

	@Query(() => [Product])
	getProductByColor(
		@Args('getProductByColor') getProductByColor: GetProductByColor
	) {
		return this.productService.getProductByColor(
			getProductByColor.slug,
			getProductByColor.colorId
		)
	}

	@Mutation(() => Product)
	@AuthAdmin('admin')
	deleteProduct(@Args('deleteProductById') deleteProductById: GetProductById) {
		return this.productService.delete(deleteProductById.id)
	}
}
