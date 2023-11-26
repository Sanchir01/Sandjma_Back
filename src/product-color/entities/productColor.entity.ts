import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ProductColor {
	@Field(() => Int)
	id: number

	@Field()
	name: string

	@Field()
	slug: string
}
