import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PaginationInput {
	@Field({ nullable: true })
	page?: string

	@Field({ nullable: true })
	perPage?: string
}
