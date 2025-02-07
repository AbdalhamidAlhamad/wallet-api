import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsRequestDto } from '~/core/dtos';
import { TransactionType } from '~/transaction/enums';

export class TransactionFiltersRequestDto extends PageOptionsRequestDto {
  @ApiPropertyOptional({ example: TransactionType.TOP_UP, enum: TransactionType })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;
}
