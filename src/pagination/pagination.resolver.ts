import { Resolver } from '@nestjs/graphql';
import { PaginationService } from './pagination.service';

@Resolver()
export class PaginationResolver {
  constructor(private readonly paginationService: PaginationService) {}
}
