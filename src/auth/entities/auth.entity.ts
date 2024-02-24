import { Field, ObjectType } from '@nestjs/graphql'
import { returnUserFields } from 'src/user/entities/user.entity'

@ObjectType()
export class AuthResponse {
	@Field()
	refreshToken: string

	@Field(() => returnUserFields)
	user: returnUserFields
}

@ObjectType()
export class newTokensResponse {
	@Field()
	refreshToken: string

	@Field(() => returnUserFields)
	User: returnUserFields
}
