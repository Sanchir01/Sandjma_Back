import { UnauthorizedException } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/decorators/auth.decorator'
import { User } from 'src/user/entities/user.entity'
import { CategoryService } from './category.service'
import {
	CreateCategoryInput,
	GetCategoryByIdInput,
	GetCategoryBySlugInput,
	UpdateCategoryInput
} from './dto/createCategory.input'
import { ResponseCategory } from './entities/category.entity'

@Resolver()
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Query(() => [ResponseCategory], { description: 'allCategories' })
	getAllCategories() {
		return this.categoryService.getAllCategory()
	}

	@Mutation(() => ResponseCategory)
	@Auth()
	createCategory(
		@Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
		@Context('user') user: User
	) {
		if (user.isAdmin === true) {
			return this.categoryService.createCategory(createCategoryInput)
		} else {
			throw new UnauthorizedException('Ты не администратор!')
		}
	}

	@Mutation(() => ResponseCategory)
	@Auth()
	updateCategory(
		@Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
		@Context('user') user: User
	) {
		if (user.isAdmin === true) {
			return this.categoryService.update(
				updateCategoryInput.id,
				updateCategoryInput
			)
		} else throw new UnauthorizedException('Ты не администратор!')
	}

	@Mutation(() => ResponseCategory)
	@Auth()
	deleteCategory(@Args('id') id: number, @Context('user') user: User) {
		if (user.isAdmin === true) {
			return this.categoryService.deleteCategory(id)
		} else {
			throw new UnauthorizedException('Ты не администратор!')
		}
	}

	@Query(() => ResponseCategory, { description: 'nameGetCategoryBySlug' })
	getCategoryBySlug(
		@Args('getCategoryBySlugInput')
		getCategoryBySlugInput: GetCategoryBySlugInput
	) {
		return this.categoryService.getCategoryBySlug(getCategoryBySlugInput.slug)
	}

	@Query(() => ResponseCategory)
	getCategoryById(
		@Args('getCategoryByIdInput') getCategoryByIdInput: GetCategoryByIdInput
	) {
		return this.categoryService.getCategoryById(getCategoryByIdInput.id)
	}
}
