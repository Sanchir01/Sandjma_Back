import { UnauthorizedException } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/decorators/auth.decorator'
import { User } from 'src/user/entities/user.entity'
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
	@Auth()
	createProduct(
		@Context('user') user: User,
		@Args('createProductInput') createProductInput: CreateProductInput
	) {
		if (user.isAdmin === true) {
			return this.productService.createProduct(createProductInput)
		} else {
			throw new UnauthorizedException('Ты должен быть администратором')
		}
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
	@Auth()
	deleteProduct(
		@Context('user') user: User,
		@Args('deleteProductById') deleteProductById: GetProductById
	) {
		if (user.isAdmin === true) {
			return this.productService.delete(deleteProductById.id)
		} else {
			throw new UnauthorizedException('Ты не администратор!')
		}
	}
}
