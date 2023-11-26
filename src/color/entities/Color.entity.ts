import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ProductFiled {
	@Field(() => Int)
	id: number

	@Field()
	name: string

	@Field(() => Int)
	categoryId: number
}

@ObjectType()
export class ReturnColors {
	@Field(() => Int)
	id: number

	@Field()
	name: string

	@Field()
	slug: string

	@Field()
	imageCss: string

	@Field(() => [ProductFiled])
	products: ProductFiled[]
}
