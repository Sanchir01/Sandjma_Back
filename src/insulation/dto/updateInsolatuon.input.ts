import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateInsolationInput {
	@Field()
	name: string
}

@InputType()
export class DeleteInsolationInput {
	@Field()
	name: string
}
