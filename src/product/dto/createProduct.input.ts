import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateProductInput {
	@Field()
	name: string

	@Field()
	description: string

	@Field()
	categorySlug: string

	@Field(() => Int)
	price: number

	@Field(() => [String])
	images: string[]

	@Field(() => [String])
	size: string[]

	@Field()
	insolation: string

	@Field(() => [String])
	colors: string[]

	@Field()
	productColor: string

	@Field({ nullable: true })
	sellers: boolean

	@Field({ nullable: true })
	news: boolean
}
