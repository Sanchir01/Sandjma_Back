import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Size {
	@Field(() => Int)
	id: number

    @Field()
	name: string
}
