import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Request, Response } from 'express'
import { Auth } from 'src/decorators/auth.decorator'
import { AuthService } from './auth.service'
import { AuthInput } from './dto/auth.input'
import { LoginInput } from './dto/login.input'
import { AuthResponse, newTokensResponse } from './entities/auth.entity'

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => AuthResponse)
	async register(
		@Args('authInput') authInput: AuthInput,
		@Context('res') res: Response
	) {
		const { accessToken, ...user } = await this.authService.register(authInput)
		await this.authService.addAccessToken(res, accessToken)
		return user
	}

	@Mutation(() => AuthResponse)
	async login(
		@Args('loginInput') loginInput: LoginInput,
		@Context('res') res: Response
	) {
		const { accessToken, ...user } = await this.authService.login(loginInput)
		console.log(user)
		await this.authService.addAccessToken(res, accessToken)

		return user
	}

	@Auth()
	@Mutation(() => newTokensResponse)
	async newToken(@Context('req') req: Request) {
		const user = await this.authService.getNewTokens(
			req.cookies.accessToken as string
		)
		return user
	}
}
