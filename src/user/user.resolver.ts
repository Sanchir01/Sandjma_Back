import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthAdmin } from 'src/decorators/auth.decorator'
import { UpdateUserProfileInput } from './dto/updateUserProfile.input'
import { JwtReturnUserFields, User } from './entities/user.entity'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => User)
	@AuthAdmin()
	getProfile(@Context('user') user: JwtReturnUserFields) {
		return this.userService.getUserProfile(user.id)
	}

	@Mutation(() => User)
	@AuthAdmin()
	updateProfile(
		@Context('user') user: JwtReturnUserFields,
		@Args('updateUserProfileInput')
		updateUserProfileInput: UpdateUserProfileInput
	) {
		return this.userService.updateUserProfile(user.id, updateUserProfileInput)
	}
}
