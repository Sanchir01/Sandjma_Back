import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import * as jwt from 'jsonwebtoken'
import { EnumTokens } from '../enum.tokens'

@Injectable()
export class AuthGuards implements CanActivate {
	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context).getContext()
		console.log(ctx.req.cookies[EnumTokens.REFRESH_TOKEN])
		if (!ctx.req.cookies[EnumTokens.REFRESH_TOKEN]) {
			return false
		}
		ctx.user = await this.validateToken(
			ctx.req.cookies[EnumTokens.REFRESH_TOKEN]
		)
		const user = ctx.user
		return user
	}

	async validateToken(auth: string) {
		try {
			return jwt.verify(auth, process.env.JWT_KEY)
		} catch (e) {
			throw new UnauthorizedException('Невалидный токен')
		}
	}
}
