import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Insolation {
	@Field(() => Int)
	id: number

	@Field()
	name: string

	@Field()
	slug: string

}
