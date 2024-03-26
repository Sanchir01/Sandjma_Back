import {
	CanActivate,
	ExecutionContext,
	UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import * as jwt from 'jsonwebtoken'
import { EnumTokens } from '../enum.tokens'

export class NewTokenGuard implements CanActivate {
	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context).getContext()
		if (!ctx.req.cookies[EnumTokens.ACCESS_TOKEN]) {
			return false
		}
		ctx.user = await this.validateToken(
			ctx.req.cookies[EnumTokens.ACCESS_TOKEN]
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
