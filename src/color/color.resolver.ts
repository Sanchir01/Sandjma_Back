import { ForbiddenException } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/decorators/auth.decorator'
import { User } from 'src/user/entities/user.entity'
import { ColorService } from './color.service'
import { CreateColorInput } from './dto/CreateColor.input'
import { ReturnColors } from './entities/Color.entity'

@Resolver()
export class ColorResolver {
	constructor(private readonly colorService: ColorService) {}

	@Query(() => [ReturnColors])
	async getAllColors() {
		return this.colorService.getAllColors()
	}

	@Mutation(() => ReturnColors)
	@Auth()
	async createColor(
		@Args('createReturnColorsInput') createColorInput: CreateColorInput,
		@Context('user') user: User
	) {
		if (user.isAdmin === true) {
			return this.colorService.createColor(createColorInput)
		} else {
			throw new ForbiddenException('Вы не администратор')
		}
	}

	@Mutation(() => ReturnColors)
	@Auth()
	async updateColor(
		@Args('updateReturnColorsInput')
		createColorInput: CreateColorInput,
		@Context('user') user: User
	) {
		if (user.isAdmin === true) {
			return this.colorService.updateColor(createColorInput)
		} else {
			throw new ForbiddenException('Вы не администратор')
		}
	}

	@Mutation(() => ReturnColors)
	@Auth()
	async deleteColor(
		@Args('deleteReturnColorsInput')
		createColorInput: CreateColorInput,
		@Context('user') user: User
	) {
		if (user.isAdmin === true) {
			return this.colorService.deleteColor(createColorInput.name)
		} else {
			throw new ForbiddenException('Вы не администратор')
		}
	}
}
