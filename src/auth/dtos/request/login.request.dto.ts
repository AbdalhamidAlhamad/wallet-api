import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
const PASSWORD_MIN_LENGTH = 6;

export class LoginRequestDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'myPassword' })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  password!: string;
}
