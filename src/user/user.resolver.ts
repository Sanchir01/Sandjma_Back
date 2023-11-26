import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/decorators/auth.decorator'
import { UpdateUserProfileInput } from './dto/updateUserProfile.input'
import { JwtReturnUserFields, User } from './entities/user.entity'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => User)
	@Auth()
	getProfile(@Context('user') user: JwtReturnUserFields) {
		return this.userService.getUserProfile(user.id)
	}

	@Mutation(() => User)
	@Auth()
	updateProfile(
		@Context('user') user: JwtReturnUserFields,
		@Args('updateUserProfileInput')
		updateUserProfileInput: UpdateUserProfileInput
	) {
		return this.userService.updateUserProfile(user.id, updateUserProfileInput)
	}

	@Mutation(() => String)
	@Auth()
	toggleFavoritesProfile(
		@Context('user') user: JwtReturnUserFields,
		@Args('productId') productId: number
	) {
		return this.userService.toggleFavoritesProfile(user.id, productId)
	}
}
