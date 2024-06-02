import { Injectable } from '@nestjs/common'

import { ForbiddenError } from '@nestjs/apollo'

import { InjectBot } from 'nestjs-telegraf'
import { PrismaService } from 'src/prisma/prisma.service'
import { finalPrice } from 'src/utils/convert-to-number'
import { createFileXlsx } from 'src/utils/createOrderXLSX'
import { Context, Telegraf } from 'telegraf'
import { CreateOrderInput } from './dto/CreateOrder.input'
@Injectable()
export class OrderService {
	constructor(
		private prisma: PrismaService,
		@InjectBot() private bot: Telegraf<Context>
	) {}

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
		await this.prisma.order.create({
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

		const price = await finalPrice(createOrderInput)

		await createFileXlsx(createOrderInput, user.phone, price)

		await this.bot.telegram
			.sendDocument(process.env.CHAT_ID, {
				source: './Заказ.xlsx',
				filename: 'Заказ.xlsx'
			})
			.catch(er => console.log(er.message))

		return 'success'
	}
}
