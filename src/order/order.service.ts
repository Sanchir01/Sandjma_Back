import { Injectable } from '@nestjs/common'

import { ForbiddenError } from '@nestjs/apollo'
import excel from 'exceljs'
import TelegramBot from 'node-telegram-bot-api'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateOrderInput } from './dto/CreateOrder.input'

@Injectable()
export class OrderService {
	private readonly bot: TelegramBot
	constructor(private prisma: PrismaService) {
		this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })
	}

	async getAll(userId: number) {
		const allOrders = await this.prisma.order.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
			include: {
				items: {
					include: {
						product: true
					}
				}
			}
		})

		return allOrders
	}

	async placeOrder(userId: number, createOrderInput: CreateOrderInput) {
		const order = await this.prisma.order.create({
			data: {
				items: {
					create: createOrderInput.items.map(item => ({
						quantity: item.quantity,
						price: item.price,
						productId: item.productId
					}))
				},
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		const user = await this.prisma.user.findUnique({ where: { id: userId } })
		if (!user) {
			throw new ForbiddenError('пройдите регистрацию')
		}
		console.log(order)

		const price = await this.finalPrice(createOrderInput)

		await this.createFileXlsx(createOrderInput, user.phone, price)
		const fileOptions = {
			filename: 'Заказ.xlsx',
			contentType: 'text/plain'
		}
		await this.bot
			.sendDocument(-1002045912785, './Заказ.xlsx', {}, fileOptions)
			.catch(er => console.log(er))

		return 'success'
	}

	private async createFileXlsx(
		createOrderInput: CreateOrderInput,
		phone: string,
		allPrice: number
	) {
		const workbook = new excel.Workbook()
		const worksheet = workbook.addWorksheet('Заказ')
		const centering: Partial<excel.Column> = {
			alignment: {
				vertical: 'middle',
				horizontal: 'center'
			}
		}
		const centeringAndFont: Partial<excel.Column> = {
			alignment: {
				vertical: 'middle',
				horizontal: 'center'
			},
			font: {
				bold: true,
				size: 14
			}
		}
		worksheet.columns = [
			{
				header: 'Название товара',
				key: 'Название_товара',
				width: 40,
				style: centering
			},

			{
				header: 'цена товара',
				key: 'цена_товара',
				width: 20,
				style: centering
			},
			{
				header: 'количество',
				key: 'количество',
				width: 20,
				style: centering
			},
			{
				header: 'цвет товара',
				key: 'цвет_товара',
				width: 20,
				style: centering
			},
			{
				header: 'размер товара',
				key: 'размер_товара',
				width: 20,
				style: centering
			},
			{
				header: 'номер пользователя',
				key: 'номер_пользователя',
				width: 20,
				style: centeringAndFont
			},
			{
				header: 'итоговая цена',
				key: 'итоговая_цена',
				width: 20,
				style: centeringAndFont
			}
		]
		await createOrderInput.items.map(item => {
			worksheet.addRows([
				{
					Название_товара: item.productName,
					цена_товара: item.price,
					количество: item.quantity,
					цвет_товара: item.productColor,
					размер_товара: item.size
				}
			])
		})
		await worksheet.addRow({
			номер_пользователя: phone,
			итоговая_цена: allPrice
		})
		try {
			await workbook.xlsx.writeFile('./Заказ.xlsx')
			console.log('Файл сохранен успешно')
		} catch (er) {
			console.log('ошибка', er)
		}
	}
	private finalPrice(createOrderInput: CreateOrderInput) {
		const allPriceSum = createOrderInput.items.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
		)
		return allPriceSum
	}
}
