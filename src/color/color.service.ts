import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateColorInput } from './dto/CreateColor.input'
import { ReturnObjectFieldsColor } from './returnObject.fields'

@Injectable()
export class ColorService {
	constructor(private prisma: PrismaService) {}

	async getAllColors() {
		return this.prisma.color.findMany({
			...ReturnObjectFieldsColor
		})
	}

	async createColor(createColorInput: CreateColorInput) {
		await this.isExistColor(createColorInput.name)
		return this.prisma.color.create({
			data: {
				name: createColorInput.name,
				slug: createColorInput.name.toLowerCase().replace(/\s+/g, '-'),
				imageCss: createColorInput.imageCss
			},
			...ReturnObjectFieldsColor
		})
	}

	async updateColor(createColorInput: CreateColorInput) {
		const old = await this.getOldColor(createColorInput.name)
		return await this.prisma.color.update({
			where: { name: createColorInput.name },
			data: {
				name: createColorInput.name ? createColorInput.name : old.name,
				slug: createColorInput.name
					? createColorInput.name.toLowerCase().replace(/\s+/g, '-')
					: old.slug,
				imageCss: createColorInput.imageCss
					? createColorInput.imageCss
					: old.imageCss
			},
			...ReturnObjectFieldsColor
		})
	}

	async deleteColor(name: string) {
		await this.getOldColor(name)

		return await this.prisma.color.delete({ where: { name: name } })
	}

	async getOldColor(name: string) {
		const oldColor = await this.prisma.color.findUnique({
			where: { name: name }
		})
		if (!oldColor) throw new NotFoundException('Такого цвета нету')

		return oldColor
	}

	async isExistColor(name: string) {
		const oldColor = await this.prisma.color.findUnique({
			where: { name: name }
		})
		if (oldColor) throw new BadRequestException('Такой цвет уже есть')
	}
}
