import { Field, InputType } from '@nestjs/graphql'
import { PaginationInput } from 'src/pagination/pagination.input'

export enum EnumProductSort {
	HIGH_PRICE = 'hight-price',
	LOW_PRICE = 'low-price',
	NEWEST = 'newest',
	OLDEST = 'oldest'
}

@InputType()
export class GetAllProductInput extends PaginationInput {
	@Field({ nullable: true })
	sort?: EnumProductSort

	@Field({ nullable: true })
	searchTerm?: string

	@Field({ nullable: true })
	maxPrice?: string

	@Field({ nullable: true })
	minPrice?: string

	@Field({ nullable: true })
	categoryId?: string

	@Field({ nullable: true, defaultValue: false })
	newProduct: boolean

	@Field({ nullable: true, defaultValue: false })
	seller: boolean
}


