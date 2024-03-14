import { Field, ObjectType } from '@nestjs/graphql'
import { returnUserFields } from 'src/user/entities/user.entity'

@ObjectType()
export class AuthResponse {
	@Field()
	accessToken: string

	@Field()
	refreshToken: string

	@Field(() => returnUserFields)
	user: returnUserFields
}

@ObjectType()
export class NewTokensResponse {
	@Field()
	refreshToken: string

	@Field(() => returnUserFields)
	user: returnUserFields
}
