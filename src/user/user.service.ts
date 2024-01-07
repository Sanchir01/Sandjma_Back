import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateUserProfileInput } from './dto/updateUserProfile.input'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getUserProfile(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
				isAdmin: true,
				password: true,
				avatarPath: true,
				favorites: {
					select: {
						id: true,
						name: true,
						images: true,
						slug: true,
						price: true,
						productColorId: true,
						insulationId: true,
						colors: {
							select: {
								id: true,
								name: true,
								imageCss: true
							}
						},
						size: {
							select: {
								id: true,
								name: true
							}
						}
					}
				}
			}
		})
		if (!user) throw new NotFoundException('Такого пользователя нету')
		return user
	}

	async updateUserProfile(
		id: number,
		updateUserProfileInput: UpdateUserProfileInput
	) {
		const isSameUser = await this.prisma.user.findUnique({
			where: { email: updateUserProfileInput.email }
		})
		if (isSameUser && id !== isSameUser.id) {
			throw new BadRequestException('Email уже занят')
		}

		const user = await this.getUserProfile(id)

		return this.prisma.user.update({
			where: { id },
			data: {
				email: updateUserProfileInput.email
					? updateUserProfileInput.email
					: user.email,
				name: updateUserProfileInput.name
					? updateUserProfileInput.name
					: user.name,
				avatarPath: updateUserProfileInput.avatarPath
					? updateUserProfileInput.avatarPath
					: user.avatarPath,
				password: updateUserProfileInput.password
					? updateUserProfileInput.password
					: user.password
			}
		})
	}

	async toggleFavoritesProfile(id: number, productId: number) {
		const user = await this.getUserProfile(id)

		if (!user) throw new NotFoundException('User not found')

		const isExist = user.favorites.some(product => product.id === productId)

		await this.prisma.user.update({
			where: { id: user.id },
			data: {
				favorites: {
					[isExist ? 'disconnect' : 'connect']: {
						id: productId
					}
				}
			}
		})

		return isExist ? 'Удален из избранного' : 'Добавлен в избранное'
	}
}
