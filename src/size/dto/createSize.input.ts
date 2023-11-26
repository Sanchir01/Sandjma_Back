import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateSizeInput {
	@Field()
	name: string
}
