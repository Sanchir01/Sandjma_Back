import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthAdmin } from 'src/decorators/auth.decorator'
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
	@AuthAdmin('admin')
	async crateInsolation(
		@Args('createInsolationInput') createInsolationInput: CreateInsolationInput
	) {
		return this.insolationService.createInsolation(createInsolationInput)
	}

	@Mutation(() => Insolation)
	@AuthAdmin('admin')
	async updateInsolation(
		@Args('updateInsolationInput') updateInsolationInput: UpdateInsolationInput
	) {
		return this.insolationService.updateInsolation(updateInsolationInput)
	}

	@AuthAdmin('admin')
	@Mutation(() => Insolation)
	async deleteInsolation(
		@Args('deleteInsolationInput') deleteInsolationInput: DeleteInsolationInput
	) {
		return this.insolationService.deleteInsolation(deleteInsolationInput.name)
	}
}
