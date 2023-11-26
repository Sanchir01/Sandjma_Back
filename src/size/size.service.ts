import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateSizeInput } from './dto/createSize.input'

@Injectable()
export class SizeService {
	constructor(private prisma: PrismaService) {}

	getAllSize() {
		return this.prisma.size.findMany()
	}

	async createSize(createSizeInput: CreateSizeInput) {
		const isExistSize = await this.prisma.size.findUnique({
			where: { name: createSizeInput.name }
		})
		if (isExistSize) throw new BadRequestException('Такая категория уже есть')
		return await this.prisma.size.create({
			data: {
				name: createSizeInput.name,
				slug: createSizeInput.name.toLowerCase().replace(/\s+/g, '-')
			}
		})
	}

	async deleteSize(id: number) {
		const isExistSize = await this.prisma.size.findUnique({ where: { id: id } })

		if (!isExistSize) throw new NotFoundException('Такой категории нету')
		return await this.prisma.size.delete({ where: { id } })
	}
}
