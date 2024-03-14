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
}
