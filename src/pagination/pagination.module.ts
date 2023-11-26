import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { PaginationResolver } from './pagination.resolver';

@Module({
  providers: [PaginationResolver, PaginationService],
  exports:[PaginationService]
})
export class PaginationModule {}
