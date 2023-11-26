import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateCategoryInput {
	@Field()
	name: string

	@Field({ nullable: true })
	image: string
}

@InputType()
export class UpdateCategoryInput {
	@Field(() => Int)
	id: number

	@Field()
	name: string

	@Field({ nullable: true })
	image: string
}

@InputType()
export class GetCategoryByIdInput {
	@Field(() => Int)
	id: number
}

@InputType()
export class GetCategoryBySlugInput {
	@Field()
	slug: string
}
