/* eslint-disable @typescript-eslint/no-var-requires */
import {
	BadGatewayException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import {
	CreateCategoryInput,
	UpdateCategoryInput
} from './dto/createCategory.input'
import { returnCategoryObject } from './return-category.obj'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async getAllCategory() {
		const allCategory = await this.prisma.category.findMany({
			select: {
				...returnCategoryObject
			}
		})
		return allCategory
	}

	async createCategory(createCategoryInput: CreateCategoryInput) {
		const isExistCategory = await this.prisma.category.findUnique({
			where: { name: createCategoryInput.name }
		})
		if (isExistCategory)
			throw new BadGatewayException('Такая категория уже есть')

		return this.prisma.category.create({
			data: {
				name: createCategoryInput.name,
				slug: createCategoryInput.name.toLowerCase().replace(/\s+/g, '-'),
				image: createCategoryInput.image
			}
		})
	}

	async getCategoryById(id: number) {
		const category = await this.prisma.category.findUnique({
			where: { id },
			select: {
				...returnCategoryObject
			}
		})
		if (!category) throw new NotFoundException('Категория не найдена')

		return category
	}

	async update(id: number, updateCategoryInput: UpdateCategoryInput) {
		return this.prisma.category.update({
			where: { id },
			data: {
				name: updateCategoryInput.name,
				slug: updateCategoryInput.name.toLowerCase().replace(/\s+/g, '-'),
				image: updateCategoryInput.image
			}
		})
	}

	async deleteCategory(id: number) {
		return this.prisma.category.delete({
			where: { id }
		})
	}

	async getCategoryBySlug(slug: string) {
		const category = await this.prisma.category.findUnique({
			where: { slug },
			select: {
				...returnCategoryObject
			}
		})
		if (!category) throw new NotFoundException('Категория не найдена')

		return category
	}
}
