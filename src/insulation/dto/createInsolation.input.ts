import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateInsolationInput {
	@Field()
	name: string
}
