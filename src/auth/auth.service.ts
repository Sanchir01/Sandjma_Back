import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
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
			throw new NotFoundException('Непправильный номер телефона')

		const isValidPassword = await verify(
			oldUserPhone.password,
			loginInput.password
		)
		if (!isValidPassword) throw new NotFoundException('Непправильный пароль')

		const tokens = await this.issueTokens(oldUserPhone)

		return { ...tokens, user: this.returnUserFields(oldUserPhone) }
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verify(refreshToken)

		if (!result) throw new UnauthorizedException('Невалидный рефреш токен')

		const user = await this.prisma.user.findUnique({ where: { id: result.id } })

		const tokens = await this.issueTokens(user)

		return { User: this.returnUserFields(user), ...tokens }
	}

	private async issueTokens(user: User) {
		const data = { id: user.id, isAdmin: user.isAdmin }
		const accessToken = this.jwt.sign(data, { expiresIn: '7d' })
		const refreshToken = this.jwt.sign(data, { expiresIn: '2d' })

		return { accessToken, refreshToken }
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email,
			isAdmin: user.isAdmin
		}
	}
	addAccessToken(res: Response, accessToken: string) {
		const expireIn = new Date()
		expireIn.setDate(expireIn.getDate() + 7)

		res.cookie(EnumTokens.ACCESS_TOKEN, accessToken, {
			httpOnly: true,
			domain: 'localhost',
			secure: false,
			expires: expireIn,
			sameSite: 'strict'
		})
	}
	addRefreshTokenFromCookie(res: Response, refreshToken: string) {
		const expireIn = new Date()
		expireIn.setDate(expireIn.getDate() + 1)

		res.cookie(EnumTokens.REFRESH_TOKEN, refreshToken, {
			httpOnly: false,
			domain: 'localhost',
			secure: false,
			expires: expireIn,
			sameSite: 'strict'
		})
	}
}
