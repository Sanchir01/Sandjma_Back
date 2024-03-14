import { UseGuards, applyDecorators } from '@nestjs/common'
import { OnlyAdminGuard } from 'src/auth/guards/admin.guard'
import { AuthGuards } from 'src/auth/guards/auth.guard'
import { NewTokenGuard } from 'src/auth/guards/newToken.guard'

export const AuthNewToken = () => UseGuards(new NewTokenGuard())

export type TypeRole = 'admin' | 'user'
export const AuthAdmin = (role: TypeRole = 'user') =>
	applyDecorators(
		role === 'admin'
			? UseGuards(new AuthGuards(), OnlyAdminGuard)
			: UseGuards(new AuthGuards())
	)
