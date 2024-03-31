import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import * as cookie from 'cookie'
import { Response } from 'express'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthInput } from './dto/auth.input'
import { LoginInput } from './dto/login.input'
import { EnumTokens } from './enum.tokens'
@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService
	) {}

	async register(authInput: AuthInput) {
		const oldEmail = await this.prisma.user.findUnique({
			where: { email: authInput.email }
		})
		if (oldEmail)
			throw new BadRequestException('Пользователь с таким эмейлом уже есть')

		const oldPhone = await this.prisma.user.findUnique({
			where: { phone: authInput.phone }
		})
		if (oldPhone)
			throw new BadRequestException('Пользователь с таким phone уже есть')

		const newUser = await this.prisma.user.create({
			data: {
				name: 'User',
				email: authInput.email,
				phone: authInput.phone,
				isAdmin: false,
				password: await hash(authInput.password),
				avatarPath:
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwkSG4hwv2fRWeLXO-hdy4hpGTK6sTfuvN6Q&usqp=CAU'
			}
		})

		const tokens = await this.issueTokens(newUser)

		return { user: this.returnUserFields(newUser), ...tokens }
	}

	async login(loginInput: LoginInput) {
		const oldUserPhone = await this.prisma.user.findUnique({
			where: { phone: loginInput.phone }
		})
		if (!oldUserPhone)
			throw new UnauthorizedException('Неправильный номер телефона')

		const isValidPassword = await verify(
			oldUserPhone.password,
			loginInput.password
		)
		if (!isValidPassword) throw new UnauthorizedException('Неправильный пароль')

		const tokens = await this.issueTokens(oldUserPhone)

		return { ...tokens, user: this.returnUserFields(oldUserPhone) }
	}

	async getNewTokens(accessToken: string) {
		const result = await this.jwt.verify(accessToken)

		if (!result) throw new UnauthorizedException('Невалидный рефреш токен')

		const user = await this.prisma.user.findUnique({ where: { id: result.id } })

		const tokens = await this.issueTokens(user)

		return { user: this.returnUserFields(user), ...tokens }
	}

	private async issueTokens(user: User) {
		const data = { id: user.id, isAdmin: user.isAdmin }
		const accessToken = this.jwt.sign(data, { expiresIn: '14d' })
		const refreshToken = this.jwt.sign(data, { expiresIn: '1h' })
		return { accessToken, refreshToken }
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email,
			isAdmin: user.isAdmin
		}
	}

	AddRefreshToken(res: Response, refreshToken: string) {
		const refreshDate = new Date()
		refreshDate.setHours(refreshDate.getHours() + 4)

		res.setHeader(
			'Set-Cookie',
			cookie.serialize(EnumTokens.REFRESH_TOKEN, refreshToken, {
				partitioned: true,
				httpOnly: false,
				path: '/',
				sameSite: 'lax',
				expires: refreshDate,
				secure: true
			})
		)
	}
	AddTwoTokens(res: Response, refreshToken: string, accessToken: string) {
		const refreshDate = new Date()
		refreshDate.setHours(refreshDate.getHours() + 4)
		const accessDate = new Date()
		accessDate.setDate(accessDate.getDate() + 14)

		res.setHeader('Set-Cookie', [
			cookie.serialize(EnumTokens.REFRESH_TOKEN, refreshToken, {
				httpOnly: false,
				expires: refreshDate,
				path: '/',
				sameSite: 'lax',

				secure: true,
				partitioned: true
			}),
			cookie.serialize(EnumTokens.ACCESS_TOKEN, accessToken, {
				httpOnly: true,
				expires: accessDate,

				path: '/',
				sameSite: 'lax',
				secure: true,
				partitioned: true
			})
		])
	}

	removeRefreshToken(res: Response) {
		res.setHeader('Set-Cookie', [
			cookie.serialize(EnumTokens.REFRESH_TOKEN, '', {
				httpOnly: false,
				expires: new Date(0),
				sameSite: 'none',
				path: '/',
				secure: true,
				partitioned: true
			}),
			cookie.serialize(EnumTokens.ACCESS_TOKEN, '', {
				httpOnly: true,
				expires: new Date(0),
				domain:
					process.env.NODE_ENV !== 'development'
						? 'localhost'
						: process.env.DOMAIN_PROD,
				sameSite: 'none',
				secure: true,
				partitioned: true
			})
		])
	}
}
