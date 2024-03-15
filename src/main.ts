import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	app.enableCors({
		credentials: true,
		origin:
			process.env.NODE_ENV === 'production'
				? 'https://www.sandjma.ru'
				: 'localhost'
	})
	app.use(cookieParser())
	await app.listen(process.env.PORT)
}
bootstrap()
