import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

const MIN_AMOUNT = 0.1;
const MAX_AMOUNT = 2000;
export class TopUpRequestDto {
  @ApiProperty({ example: 100.55 })
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Min(MIN_AMOUNT)
  @Max(MAX_AMOUNT)
  amount!: number;
}
