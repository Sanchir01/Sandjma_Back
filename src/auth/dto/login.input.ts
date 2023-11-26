import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
	@Field()
	password: string

	@Field()
	phone: string
}
