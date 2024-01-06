import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { AuthInput } from './dto/auth.input'
import { LoginInput } from './dto/login.input'
import { AuthResponse } from './entities/auth.entity'

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => AuthResponse)
	async register(
		@Args('authInput') authInput: AuthInput,
		@Context('res') res: Response
	) {
		const user = await this.authService.register(authInput)
		await this.authService.addAccessToken(res, user.accessToken)
		return user
	}

	@Mutation(() => AuthResponse)
	async login(
		@Args('loginInput') loginInput: LoginInput,
		@Context('res') res: Response
	) {
		const user = await this.authService.login(loginInput)

		await this.authService.addAccessToken(res, user.accessToken)
		console.log(user, res)
		return user
	}

	@Mutation(() => AuthResponse)
	async newToken(@Context('req') req: Request) {
		const user = await this.authService.getNewTokens(
			req.cookies.accessToken as string
		)
		return user
	}
}
