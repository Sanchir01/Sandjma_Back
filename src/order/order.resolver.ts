import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthAdmin } from 'src/decorators/auth.decorator'
import { User } from 'src/user/entities/user.entity'
import { CreateOrderInput } from './dto/CreateOrder.input'
import { OrderService } from './order.service'

@Resolver()
export class OrderResolver {
	constructor(private readonly orderService: OrderService) {}

	@Query(() => String)
	@AuthAdmin()
	async getAllOrders(@Context('user') user: User) {
		return this.orderService.getAll(user.id)
	}

	@Mutation(() => String)
	@AuthAdmin()
	async placeOrderOne(
		@Context('user') user: User,
		@Args('createOrderInput') createOrderInput: CreateOrderInput
	) {
		console.log(user)
		
		return this.orderService.placeOrder(user.id, createOrderInput)
	}
}
