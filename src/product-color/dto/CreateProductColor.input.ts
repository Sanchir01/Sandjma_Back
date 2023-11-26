import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ProductColorInput {
	@Field()
	name: string
}
