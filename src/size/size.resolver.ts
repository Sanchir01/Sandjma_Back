import { ForbiddenException } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/decorators/auth.decorator'
import { User } from 'src/user/entities/user.entity'
import { CreateSizeInput } from './dto/createSize.input'
import { Size } from './entity/size.entituy'
import { SizeService } from './size.service'

@Resolver()
export class SizeResolver {
	constructor(private readonly sizeService: SizeService) {}

	@Query(() => [Size])
	async getAllSize() {
		return this.sizeService.getAllSize()
	}

	@Mutation(() => Size)
	@Auth()
	async createSize(
		@Args('crateSizeInput') createSizeInput: CreateSizeInput,
		@Context('user') user: User
	) {
		if (user.isAdmin === true) {
			return this.sizeService.createSize(createSizeInput)
		} else {
			throw new ForbiddenException('Вы не администратор')
		}
	}

	@Mutation(() => Size)
	@Auth()
	async deleteSize(@Args('id') id: number, @Context('user') user: User) {
		if (user.isAdmin === true) {
			return this.sizeService.deleteSize(id)
		} else {
			throw new ForbiddenException('Вы не администратор')
		}
	}
}
