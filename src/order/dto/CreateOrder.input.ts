import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateOrderInput {
	@Field(() => [OrderItemDto])
	items: OrderItemDto[]
}

@InputType()
export class OrderItemDto {
	@Field(() => Int)
	quantity: number

	@Field(() => Int)
	price: number

	@Field(() => String)
	size: string

	@Field(() => String)
	productName: string

	@Field(() => String)
	productColor: string

	@Field(() => Int)
	productId: number
}
