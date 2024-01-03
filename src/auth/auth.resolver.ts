import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { AuthInput } from './dto/auth.input'
import { LoginInput } from './dto/login.input'
import { AuthResponse, newTokensResponse } from './entities/auth.entity'

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => AuthResponse)
	async register(@Args('authInput') authInput: AuthInput) {
		return this.authService.register(authInput)
	}

	@Mutation(() => AuthResponse)
	async login(
		@Args('loginInput') loginInput: LoginInput,
		@Context('res') res: Response
	) {
		const user = await this.authService.login(loginInput)
		this.authService.addAccessToken(res, user.accessToken)

		return user
	}

	@Mutation(() => newTokensResponse)
	async newToken(@Context('req') req: Request, @Context('res') res: Response) {
		const { refreshToken, ...user } = await this.authService.getNewTokens(
			req.cookies.accessToken as string
		)

		this.authService.addRefreshTokenFromCookie(res, refreshToken)

		return user
	}
}
