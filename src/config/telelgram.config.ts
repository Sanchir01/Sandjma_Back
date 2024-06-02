import { ConfigService } from '@nestjs/config'
import { TelegrafModuleOptions } from 'nestjs-telegraf'

export const getBotToken = async (
	configService: ConfigService
): Promise<TelegrafModuleOptions> => ({
	token: configService.get('TELEGRAM_TOKEN')
})
