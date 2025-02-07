import { PickType } from '@nestjs/swagger';
import { TopUpRequestDto } from './top-up.request.dto';

export class ChargeRequestDto extends PickType(TopUpRequestDto, ['amount']) {}
