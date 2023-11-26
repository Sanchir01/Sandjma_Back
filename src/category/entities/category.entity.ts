import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ResponseCategory {
	@Field(() => Int)
	id: number

	@Field()
	name: string

	@Field()
	slug: string

	@Field()
	image: string
}
