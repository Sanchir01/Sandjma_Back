import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorResolver } from './color.resolver';

@Module({
  providers: [ColorResolver, ColorService]
})
export class ColorModule {}
