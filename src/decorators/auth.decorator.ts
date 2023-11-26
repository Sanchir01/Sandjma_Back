import { UseGuards } from '@nestjs/common'
import { AuthGuards } from 'src/auth/guards/auth.guard'

export const Auth = () => UseGuards(new AuthGuards())
