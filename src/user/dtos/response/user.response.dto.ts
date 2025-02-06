import { ApiProperty } from '@nestjs/swagger';
import { User } from '~/user/entities';

export class UserResponseDto {
  @ApiProperty({ example: '1', description: 'User id' })
  id!: string;

  @ApiProperty({ example: 'Jone Doe', description: 'User full name' })
  fullName!: string;

  @ApiProperty({ example: 'test@gmail.com' })
  email!: string;

  @ApiProperty({ example: '2021-09-01T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2021-09-01T00:00:00.000Z' })
  updatedAt!: Date;

  constructor(user: User) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
