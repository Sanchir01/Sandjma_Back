import { Field, Int, ObjectType } from '@nestjs/graphql'
import { ReturnColors } from 'src/color/entities/Color.entity'
import { Size } from 'src/size/entity/size.entituy'

@ObjectType()
export class Product {
	@Field(() => Int)
	id: number

	@Field()
	name: string

	@Field()
	slug: string

	@Field()
	description: string

	@Field(() => Int)
	price: number

	@Field(() => Int)
	productColorId: number

	@Field(() => [String])
	images: string[]

	@Field(() => Int)
	categoryId: number

	@Field(() => [Size])
	size: Size[]

	@Field(() => Int)
	insulationId: number

	@Field(() => [ReturnColors])
	colors: ReturnColors[]
}

@ObjectType()
export class ReturnColor {
	id: number
	imageCss: string
	name: string
	products: Product[]
}

@ObjectType()
export class ReturnColorForProduct {
	id: number
	categoryId: number
	name: string
	insulationId: number
}

@ObjectType()
export class ReturnFieldByCreateProduct {
	@Field(() => Int)
	id: number

	@Field()
	name: string

	@Field()
	slug: string

	@Field()
	description: string

	@Field(() => Int)
	price: number

	@Field(() => [String])
	images: string[]

	@Field(() => Int)
	categoryId: number
}
@ObjectType()
export class allProductsAndLength {
	@Field(() => [Product])
	products: Product[]

	@Field(() => Int)
	length: number
}
