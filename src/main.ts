import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	app.enableCors({
		credentials: true,
		origin: true
	})
	app.use(cookieParser())
	await app.listen(process.env.PORT || 5000)
}
bootstrap().catch(() => console.log('server crashed'))
