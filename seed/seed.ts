import { faker } from '@faker-js/faker'
import { PrismaClient, Product } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.development.env' })
const prisma = new PrismaClient()

export function SlugifyString(str: string) {
	return str.toLowerCase().replace(/\s+/g, '-')
}

function getRandomNumber(): number {
	return Math.floor(Math.random() * 4)
}
const createProducts = async (quantity: number) => {
	const products: Product[] = []
	const colorsArray = ['Черный', 'Белый', 'Зеленый', 'Красный']
	const insulationArray = ['XL', 'L', 'M', 'S']
	for (let i = 0; i < quantity; i++) {
		const productName = faker.commerce.productName()
		const categoryName = faker.commerce.department()

		const product = await prisma.product.create({
			data: {
				name: productName,
				slug: SlugifyString(productName),
				description: faker.commerce.productDescription(),
				price: +faker.commerce.price({ min: 1000, max: 7000 }),
				images: Array.from({ length: 3 }).map(() =>
					faker.image.urlLoremFlickr({
						width: 350,
						height: 600
					})
				),
				seller: faker.datatype.boolean(),
				newProduct: faker.datatype.boolean(),
				category: {
					connectOrCreate: {
						where: { slug: SlugifyString(categoryName) },
						create: {
							name: categoryName,
							slug: SlugifyString(categoryName),
							image: ''
						}
					}
				},
				colors: {
					connect: colorsArray.map(color => ({
						slug: color.toLowerCase()
					}))
				},
				ProductColor: {
					connect: {
						slug: SlugifyString(colorsArray[getRandomNumber()])
					}
				},
				Insulation: {
					connect: {
						slug: SlugifyString(insulationArray[getRandomNumber()])
					}
				}
			}
		})
		products.push(product)
	}
	console.log(`Created ${products.length} products created`)
}

async function main() {
	console.log('Start seeding')
	await createProducts(10)
}
main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
