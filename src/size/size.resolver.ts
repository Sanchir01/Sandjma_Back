import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthAdmin } from 'src/decorators/auth.decorator'
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
	@AuthAdmin('admin')
	async createSize(@Args('crateSizeInput') createSizeInput: CreateSizeInput) {
		return this.sizeService.createSize(createSizeInput)
	}

	@Mutation(() => Size)
	@AuthAdmin('admin')
	async deleteSize(@Args('id') id: number) {
		return this.sizeService.deleteSize(id)
	}
}
