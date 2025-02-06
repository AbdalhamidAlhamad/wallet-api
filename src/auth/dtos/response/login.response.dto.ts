import { ApiProperty } from '@nestjs/swagger';
import { IAuthTokens } from '~/auth/interfaces';
import { UserResponseDto } from '~/user/dtos/response';
import { User } from '~/user/entities';
export class LoginResponseDto {
  @ApiProperty({ example: 'Lphj9FarxtRLXLeBmJkXLTyG4scSBcq9ZgQy4q9QPOzlWGAQ9cKxdtZTZYGEC3Ib' })
  accessToken!: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  constructor(user: User, tokens: IAuthTokens) {
    this.accessToken = tokens.accessToken;
    this.user = new UserResponseDto(user);
  }
}
