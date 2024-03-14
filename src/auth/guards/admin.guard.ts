import {
	CanActivate,
	ExecutionContext,
	ForbiddenException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User } from '@prisma/client'

export class OnlyAdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = GqlExecutionContext.create(context).getContext<{
			user: User
		}>()

		const user = request.user.isAdmin

		if (!user) throw new ForbiddenException('Ты не администратор!')

		return user
	}
}
