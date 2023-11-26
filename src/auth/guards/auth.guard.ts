import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthGuards implements CanActivate {
	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context).getContext()
		if (!ctx.req.headers.authorization) {
			return false
		}
		ctx.user = await this.validateToken(ctx.req.headers.authorization)
		const user = ctx.user
		return user
	}

	async validateToken(auth: string) {
		if (auth.split(' ')[0] !== 'Bearer') {
			throw new UnauthorizedException('Невалидный токен')
		}
		const token = auth.split(' ')[1]

		try {
			return jwt.verify(token, 'sdw@#!@#Fxd')
		} catch (e) {
			throw new UnauthorizedException('invalid token')
		}
	}
}
