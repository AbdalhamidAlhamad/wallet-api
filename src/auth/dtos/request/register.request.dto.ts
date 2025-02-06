import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 30;
const PASSWORD_MIN_LENGTH = 6;
export class RegisterRequestDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MinLength(NAME_MIN_LENGTH)
  @MaxLength(NAME_MAX_LENGTH)
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(NAME_MIN_LENGTH)
  @MaxLength(NAME_MAX_LENGTH)
  lastName!: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'myPassword' })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  password!: string;
}
