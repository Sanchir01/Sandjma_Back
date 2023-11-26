import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ProductColorInput } from './dto/CreateProductColor.input'

@Injectable()
export class ProductColorService {
	constructor(private prisma: PrismaService) {}

	async GetAllProductColor() {
		return this.prisma.productColor.findMany()
	}

	async createProductColor(productColorInput: ProductColorInput) {
		const isExistProductColor = await this.prisma.productColor.findUnique({
			where: { slug: productColorInput.name.toLowerCase() }
		})

		if (isExistProductColor)
			throw new BadRequestException('Такой цвет уже есть')
		return await this.prisma.productColor.create({
			data: {
				name: productColorInput.name,
				slug: productColorInput.name.toLowerCase().replace(/\s+/g, '-')
			}
		})
	}

	async updateProductColor(productColorInput: ProductColorInput) {
		const isExistColor = await this.prisma.productColor.findUnique({
			where: { slug: productColorInput.name.toLowerCase().replace(/\s+/g, '-') }
		})
		if (!isExistColor) throw new NotFoundException('Такого цвета нету')

		return await this.prisma.productColor.update({
			where: {
				slug: productColorInput.name.toLowerCase().replace(/\s+/g, '-')
			},
			data: {
				name: productColorInput.name,
				slug: productColorInput.name.toLowerCase().replace(/\s+/g, '-')
			}
		})
	}

	async deleteProductColor(productColorInput: ProductColorInput) {
		const isExistColor = await this.prisma.productColor.findUnique({
			where: {
				slug: productColorInput.name.toLowerCase().replace(/\s+/g, '-')
			}
		})
		if (!isExistColor) throw new NotFoundException('Такого цвета нету')
		return await this.prisma.productColor.delete({
			where: { slug: productColorInput.name.toLowerCase().replace(/\s+/g, '-') }
		})
	}
}
