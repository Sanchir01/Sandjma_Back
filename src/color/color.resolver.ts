import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthAdmin } from 'src/decorators/auth.decorator'
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
	@AuthAdmin('admin')
	async createColor(
		@Args('createReturnColorsInput') createColorInput: CreateColorInput
	) {
		return this.colorService.createColor(createColorInput)
	}

	@Mutation(() => ReturnColors)
	@AuthAdmin('admin')
	async updateColor(
		@Args('updateReturnColorsInput')
		createColorInput: CreateColorInput
	) {
		return this.colorService.updateColor(createColorInput)
	}

	@Mutation(() => ReturnColors)
	@AuthAdmin('admin')
	async deleteColor(
		@Args('deleteReturnColorsInput')
		createColorInput: CreateColorInput
	) {
		return this.colorService.deleteColor(createColorInput.name)
	}
}
