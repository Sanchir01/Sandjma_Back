import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Request, Response } from 'express'
import { AuthNewToken } from 'src/decorators/auth.decorator'
import { AuthService } from './auth.service'
import { AuthInput } from './dto/auth.input'
import { LoginInput } from './dto/login.input'
import { AuthResponse, NewTokensResponse } from './entities/auth.entity'

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

		await this.authService.AddRefreshToken(res, user.refreshToken)

		return user
	}

	@Mutation(() => AuthResponse)
	async login(
		@Args('loginInput') loginInput: LoginInput,
		@Context('res') res: Response
	) {
		const user = await this.authService.login(loginInput)
		console.log(user)
		await this.authService.addAccessToken(res, user.accessToken)

		await this.authService.AddRefreshToken(res, user.refreshToken)

		return user
	}

	@Mutation(() => String)
	async logout(@Context('res') res: Response) {
		this.authService.removeRefreshToken(res)

		return 'success'
	}

	@AuthNewToken()
	@Mutation(() => NewTokensResponse)
	async newToken(@Context('req') req: Request, @Context('res') res: Response) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { accessToken, ...user } = await this.authService.getNewTokens(
			req.cookies.accessToken as string
		)
		await this.authService.AddRefreshToken(res, user.refreshToken)

		return user
	}
}
