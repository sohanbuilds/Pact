import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  @ApiProperty({ example: 'alice@test.com' })
  email: string;
  @ApiProperty({ example: 'alice' })
  username: string;
  @ApiProperty({ example: '123456' })
  password: string;
}
