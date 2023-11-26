import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateUserProfileInput {
	@Field()
	email: string

	@Field({ nullable: true })
	name: string

	@Field({ nullable: true })
	avatarPath: string

	@Field()
	password: string
}
