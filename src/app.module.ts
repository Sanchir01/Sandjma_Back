import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'

import { TelegrafModule } from 'nestjs-telegraf'
import { CategoryModule } from './category/category.module'
import { ColorModule } from './color/color.module'
import { getBotToken } from './config/telelgram.config'
import { InsulationModule } from './insulation/insulation.module'
import { OrderModule } from './order/order.module'
import { PaginationModule } from './pagination/pagination.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProductColorModule } from './product-color/product-color.module'
import { ProductModule } from './product/product.module'
import { SizeModule } from './size/size.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getBotToken,
			inject: [ConfigService]
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			sortSchema: true,
			playground: false,
			status400ForVariableCoercionErrors: true,
			context: ({ req, res }) => ({ req, res }),
			plugins: [
				ApolloServerPluginLandingPageLocalDefault({
					footer: false,
					includeCookies: true
				}),
				ApolloServerPluginInlineTrace()
			],
			introspection: true
		}),
		PrismaModule,
		AuthModule,
		UserModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.${process.env.NODE_ENV}.env`
		}),
		ProductModule,
		PaginationModule,
		CategoryModule,
		SizeModule,
		ColorModule,
		InsulationModule,
		ProductColorModule,
		OrderModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
