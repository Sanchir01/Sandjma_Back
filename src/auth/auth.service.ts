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

	addAccessToken(res: Response, accessToken: string) {
		const expireIn = new Date()
		expireIn.setDate(expireIn.getDate() + 30)
		res.cookie(EnumTokens.ACCESS_TOKEN, accessToken, {
			httpOnly: true,
			expires: expireIn,
			domain: process.env.DOMAIN_COOKIE
				? process.env.DOMAIN_COOKIE
				: 'localhost',
			sameSite: 'strict',
			secure: true
		})
	}

	removeRefreshToken(res: Response) {
		res.cookie(EnumTokens.ACCESS_TOKEN, '', {
			domain: process.env.DOMAIN_COOKIE ? 'www.sandjma.ru' : 'localhost',
			httpOnly: true,
			expires: new Date(0),
			sameSite: 'strict'
		})
	}
}
