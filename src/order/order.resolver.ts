import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/decorators/auth.decorator'
import { User } from 'src/user/entities/user.entity'
import { CreateOrderInput } from './dto/CreateOrder.input'
import { OrderService } from './order.service'

@Resolver()
export class OrderResolver {
	constructor(private readonly orderService: OrderService) {}

	@Query(() => String)
	@Auth()
	async getAllOrders(@Context('user') user: User) {
		return this.orderService.getAll(user.id)
	}

	@Mutation(() => String)
	@Auth()
	async placeOrderOne(
		@Context('user') user: User,
		@Args('createOrderInput') createOrderInput: CreateOrderInput
	) {
		console.log(user)
		return this.orderService.placeOrder(user.id, createOrderInput)
	}
}
