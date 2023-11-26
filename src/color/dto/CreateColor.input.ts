import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateColorInput {
	@Field()
	name: string

	@Field()
	imageCss: string
}
