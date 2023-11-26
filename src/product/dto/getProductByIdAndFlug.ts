import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class GetProductById {
	@Field(() => Int)
	id: number
}

@InputType()
export class GetProductByColor {
	@Field()
	slug: string

	@Field(() => Int)
	colorId: number
}
