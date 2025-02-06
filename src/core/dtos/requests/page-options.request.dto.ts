import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

const MIN_PAGINATION_PAGE = 1;
const MAX_PAGINATION_PAGE = 10000000;
const MIN_PAGINATION_SIZE = 1;
const MAX_PAGINATION_SIZE = 50;
const DEFAULT_PAGINATION_PAGE = 1;
const DEFAULT_PAGINATION_SIZE = 10;

export class PageOptionsRequestDto {
  @ApiPropertyOptional({
    minimum: MIN_PAGINATION_PAGE,
    default: DEFAULT_PAGINATION_PAGE,
    example: DEFAULT_PAGINATION_PAGE,
    description: 'Pagination page',
  })
  @Max(MAX_PAGINATION_PAGE)
  @Min(MIN_PAGINATION_PAGE)
  @IsInt()
  @IsNumber({ allowNaN: false })
  @Transform(({ value }) => +value)
  page: number = DEFAULT_PAGINATION_PAGE;

  @ApiPropertyOptional({
    minimum: MIN_PAGINATION_SIZE,
    maximum: MAX_PAGINATION_SIZE,
    default: DEFAULT_PAGINATION_SIZE,
    example: DEFAULT_PAGINATION_SIZE,
    description: 'Pagination page size',
  })
  @Max(MAX_PAGINATION_SIZE)
  @Min(MIN_PAGINATION_SIZE)
  @IsInt()
  @IsNumber({ allowNaN: false })
  @Transform(({ value }) => +value)
  size: number = DEFAULT_PAGINATION_SIZE;
}
