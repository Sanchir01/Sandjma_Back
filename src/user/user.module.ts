import { Module } from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'
import { AuthGuards } from 'src/auth/guards/auth.guard'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
	providers: [UserResolver, UserService, JwtService, AuthGuards]
})
export class UserModule {}
