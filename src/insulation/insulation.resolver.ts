import { ForbiddenException } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/decorators/auth.decorator'
import { User } from 'src/user/entities/user.entity'
import { CreateInsolationInput } from './dto/createInsolation.input'
import {
	DeleteInsolationInput,
	UpdateInsolationInput
} from './dto/updateInsolatuon.input'
import { Insolation } from './entities/insulution.entity'
import { InsulationService } from './insulation.service'

@Resolver()
export class InsulationResolver {
	constructor(private readonly insolationService: InsulationService) {}

	@Query(() => [Insolation])
	async getAllInsolation() {
		return this.insolationService.getAll()
	}

	@Mutation(() => Insolation)
	@Auth()
	async crateInsolation(
		@Args('createInsolationInput') createInsolationInput: CreateInsolationInput,
		@Context('user') user: User
	) {
		if (user.isAdmin === true) {
			return this.insolationService.createInsolation(createInsolationInput)
		} else {
			throw new ForbiddenException('Вы не админитсратор')
		}
	}

	@Mutation(() => Insolation)
	@Auth()
	async updateInsolation(
		@Args('updateInsolationInput') updateInsolationInput: UpdateInsolationInput,
		@Context('user') user: User
	) {
		if (user.isAdmin === true) {
			return this.insolationService.updateInsolation(updateInsolationInput)
		} else {
			throw new ForbiddenException('Вы не админитсратор')
		}
	}

	@Mutation(() => Insolation)
	async deleteInsolation(
		@Args('deleteInsolationInput') deleteInsolationInput: DeleteInsolationInput,
		@Context('user') user: User
	) {
		if (user.isAdmin === true) {
			return this.insolationService.deleteInsolation(deleteInsolationInput.name)
		} else {
			throw new ForbiddenException('Вы не админитсратор')
		}
	}
}
