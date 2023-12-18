/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { convertToNumber } from 'src/utils/convert-to-number'
import { CreateProductInput } from './dto/createProduct.input'
import { EnumProductSort, GetAllProductInput } from './dto/getAllProducts.input'

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(getAllProductInput: GetAllProductInput) {
		const filter = this.createFilters(getAllProductInput)

		const { perPage, skip } =
			this.paginationService.getPagination(getAllProductInput)

		const products = await this.prisma.product.findMany({
			where: filter,
			orderBy: this.getSortOptions(getAllProductInput.sort),
			skip,
			take: perPage,
			include: { size: true, colors: true }
		})

		const all = {
			products,
			length: await this.prisma.product.count({ where: filter })
		}

		return all
	}

	async createProduct(createProductInput: CreateProductInput) {
		const colorDefault = createProductInput.colors.findIndex(
			item =>
				item.toLowerCase() === createProductInput.productColor.toLowerCase()
		)
		console.log(colorDefault)

		if (!colorDefault)
			throw new NotFoundException('Вы не правильно введи категорию')

		const isExistCategory = await this.prisma.category.findUnique({
			where: {
				slug: createProductInput.categorySlug.toLowerCase().replace(/\s+/g, '-')
			}
		})

		if (!isExistCategory) throw new BadRequestException('Нету такой категории')

		const isExistInsolution = await this.prisma.insulation.findUnique({
			where: { slug: createProductInput.insolation }
		})
		if (!isExistInsolution)
			throw new NotFoundException('Нету такой толщины одежды')

		const product = await this.prisma.product.create({
			data: {
				description: createProductInput.description,
				name: createProductInput.name,
				category: {
					connect: {
						slug: createProductInput.categorySlug
							.toLowerCase()
							.replace(/\s+/g, '-')
					}
				},
				price: createProductInput.price,
				images: createProductInput.images,
				slug: createProductInput.name.toLowerCase().replace(/\s+/g, '-'),
				newProduct: createProductInput.news ? createProductInput.news : false,
				seller: createProductInput.sellers ? createProductInput.sellers : false,
				size: {
					connect: createProductInput.size.map(item => ({
						slug: item.toLowerCase()
					}))
				},
				Insulation: {
					connect: {
						slug: createProductInput.insolation
							.toLowerCase()
							.replace(/\s+/g, '-')
					}
				},
				colors: {
					connect: createProductInput.colors.map(color => ({
						slug: color.toLowerCase()
					}))
				},
				ProductColor: {
					connect: {
						slug: createProductInput.colors[colorDefault]
							.toLowerCase()
							.replace(/\s+/g, '-')
					}
				}
			}
		})
		return product
	}

	async getProductById(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id },

			include: {
				size: true,
				colors: {
					select: {
						id: true,
						imageCss: true,
						name: true,
						slug: true,
						products: {
							select: {
								name: true,
								id: true,
								categoryId: true,
								insulationId: true
							}
						}
					}
				}
			}
		})

		if (!product) throw new NotFoundException('Товар не найден')
		console.log(product)
		return product
	}

	async getProductByColor(slug: string, colorId: number) {
		const isExistColor = await this.prisma.color.findUnique({
			where: { id: colorId }
		})
		if (!isExistColor) throw new NotFoundException('нету цвета такого')

		const product = await this.prisma.product.findMany({
			where: {
				slug: slug,
				colors: {
					some: {
						id: {
							not: colorId
						}
					}
				}
			},
			include: { size: true, colors: true }
		})

		if (!product) throw new NotFoundException('Товар не найден')
		console.log(product)
		return product
	}

	async getProductByCategory(categorySlug: string) {
		const product = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug.toLowerCase().replace(/\s+/g, '-')
				}
			},
			include: { size: true, colors: true }
		})
		if (!product) throw new NotFoundException('Товар не найден')

		return product
	}

	async delete(id: number) {
		return this.prisma.product.delete({ where: { id } })
	}

	private getSellerItemFilter(sellers: boolean): Prisma.ProductWhereInput {
		return { seller: sellers }
	}
	private getNewItemFilter(news: boolean): Prisma.ProductWhereInput {
		return { newProduct: news }
	}

	private getPriceFilter(
		minPrice?: number,
		maxPrice?: number
	): Prisma.ProductWhereInput {
		let priceFilter: Prisma.IntFilter | undefined = undefined
		if (minPrice) {
			priceFilter = {
				...priceFilter,
				gte: minPrice
			}
		}

		if (maxPrice) {
			priceFilter = {
				...priceFilter,
				lte: maxPrice
			}
		}

		return {
			price: priceFilter
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.ProductWhereInput {
		return {
			OR: [
				{
					category: {
						name: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				},
				{ name: { contains: searchTerm, mode: 'insensitive' } },
				{ description: { contains: searchTerm, mode: 'insensitive' } }
			]
		}
	}

	private getSortOptions(
		sort: EnumProductSort
	): Prisma.ProductOrderByWithRelationInput[] {
		switch (sort) {
			case EnumProductSort.LOW_PRICE:
				return [{ price: 'asc' }]
			case EnumProductSort.HIGH_PRICE:
				return [{ price: 'desc' }]
			case EnumProductSort.NEWEST:
				return [{ name: 'asc' }]
			case EnumProductSort.OLDEST:
				return [{ name: 'desc' }]
		}
	}

	private getCategoryFilter(categoryId: number): Prisma.ProductWhereInput {
		return {
			categoryId
		}
	}

	private createFilters(getAllProductInput: GetAllProductInput) {
		const filters: Prisma.ProductWhereInput[] = []

		if (getAllProductInput.searchTerm)
			filters.push(this.getSearchTermFilter(getAllProductInput.searchTerm))

		if (getAllProductInput.minPrice || getAllProductInput.maxPrice)
			filters.push(
				this.getPriceFilter(
					convertToNumber(getAllProductInput.minPrice),
					convertToNumber(getAllProductInput.maxPrice)
				)
			)

		if (getAllProductInput.seller)
			filters.push(this.getSellerItemFilter(getAllProductInput.seller))

		if (getAllProductInput.newProduct)
			filters.push(this.getNewItemFilter(getAllProductInput.newProduct))

		if (getAllProductInput.categoryId)
			filters.push(this.getCategoryFilter(+getAllProductInput.categoryId))

		return filters.length ? { AND: filters } : {}
	}
}
