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
				? [process.env.DOMAIN_PROD, `${process.env.DOMAIN_BACK}/graphql`]
				: 'http://localhost:3000'
	})
	app.use(cookieParser())
	await app.listen(process.env.PORT)
}
bootstrap()
