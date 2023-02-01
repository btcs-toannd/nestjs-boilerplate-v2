import { ApiProperty } from '@nestjs/swagger';
import PageInfo from './PageInfo';

export default class Collection<T> {
  @ApiProperty({
    description: 'List paginated data',
  })
  edges: T[];

  @ApiProperty({
    description: 'Pagination information',
    example: {
      limit: 10,
      offset: 0,
      total: 1,
    },
  })
  pageInfo: PageInfo;
}
