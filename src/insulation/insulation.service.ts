import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateInsolationInput } from './dto/createInsolation.input'
import { UpdateInsolationInput } from './dto/updateInsolatuon.input'

@Injectable()
export class InsulationService {c
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.insulation.findMany()
	}

	async createInsolation(createInsolationInput: CreateInsolationInput) {
		await this.isExistIsolation(createInsolationInput.name)

		const newInsolation = await this.prisma.insulation.create({
			data: {
				name: createInsolationInput.name,
				slug: createInsolationInput.name.toLowerCase().replace(/\s+/g, '-')
			},
			select: { id: true, name: true, slug: true }
		})

		return newInsolation
	}

	async updateInsolation(updateInsolationInput: UpdateInsolationInput) {
		const oldInsolation = await this.prisma.insulation.findUnique({
			where: { name: updateInsolationInput.name }
		})
		if (!oldInsolation) throw new NotFoundException('Такой толщины нету')

		const updateInsolation = await this.prisma.insulation.update({
			where: { name: updateInsolationInput.name },
			data: {
				name: updateInsolationInput.name
					? updateInsolationInput.name
					: oldInsolation.name,
				slug: updateInsolationInput.name
					? updateInsolationInput.name.toLowerCase().replace(/\s+/g, '-')
					: oldInsolation.slug
			}
		})
		return updateInsolation
	}

	async deleteInsolation(name: string) {
		const oldInsolation = await this.prisma.insulation.findUnique({
			where: { name: name }
		})
		if (!oldInsolation) throw new NotFoundException('Такой толщины нету')

		return await this.prisma.insulation.delete({ where: { name: name } })
	}

	async isExistIsolation(nameProp: string) {
		const isExistInsolation = await this.prisma.insulation.findUnique({
			where: { name: nameProp }
		})
		if (isExistInsolation) throw new BadRequestException('Такой цвет уже есть')
	}
}
