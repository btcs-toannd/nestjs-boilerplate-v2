import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginBodyDto {
  @ApiProperty({
    description: 'アカウント',
    example: '943aAdmin',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'パスワード',
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class TokenResponseDto {
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    example: 'LpZbYj93kL_5H__Y8DvrdnrNT90aTwGtOAxAagDfuzSi_YQY1LqDhfNgTV8uU2Ce',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Access token life time',
    example: 300000,
  })
  expireIn: number;

  @ApiProperty({
    description: 'Token type',
    example: 'bearer',
  })
  tokenType: string;
}
