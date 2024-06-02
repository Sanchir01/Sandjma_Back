import { CreateOrderInput } from 'src/order/dto/CreateOrder.input'

export function convertToNumber(input: string): number | undefined {
	const number = +input
	return isNaN(number) ? undefined : number
}

export async function finalPrice(createOrderInput: CreateOrderInput) {
	const allPriceSum = createOrderInput.items.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	)
	return allPriceSum
}
