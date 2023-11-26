import { Module } from '@nestjs/common';
import { InsulationService } from './insulation.service';
import { InsulationResolver } from './insulation.resolver';

@Module({
  providers: [InsulationResolver, InsulationService]
})
export class InsulationModule {}
