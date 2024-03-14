import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class returnUserFields {
	@Field(() => Int)
	id: number

	@Field()
	email: string

	@Field()
	isAdmin: boolean
}

@ObjectType()
export class User {
	@Field(() => Int)
	id: number

	@Field()
	name: string

	@Field()
	email: string

	@Field()
	password: string

	@Field()
	avatarPath: string

	@Field()
	isAdmin: boolean
}

@ObjectType()
export class JwtReturnUserFields {
	@Field(() => Int)
	id: number

	@Field()
	isAdmin: boolean
}
