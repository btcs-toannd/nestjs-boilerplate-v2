import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import AppResponse from 'src/common/models/AppResponse';

import { User } from 'src/common/decorators/user.decorator';
import { ErrorResponse } from 'src/common/decorators/responses/error-response.decorator';
import { GetOneSuccessResponse } from 'src/common/decorators/responses/get-one-success.decorator';
import { CreatedSuccessResponse } from 'src/common/decorators/responses/created-success.decorator';
import { RefreshTokenGuard } from 'src/modules/resources/auth/guards/refreshToken.guard';
import { AuthService } from './auth.service';
import { LoginBodyDto, TokenResponseDto } from './dto/login-dto';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('token')
  @ApiOperation({
    summary: 'Login',
    description: 'Login',
  })
  @ErrorResponse('common')
  @ErrorResponse('auth.login', { hasValidationErr: true })
  @CreatedSuccessResponse(TokenResponseDto)
  async login(@Body() loginData: LoginBodyDto) {
    const { data, err } = await this.authService.login(loginData);

    if (err) {
      throw err;
    }

    return AppResponse.ok(data);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('token/refresh')
  @ApiOperation({
    summary: 'Renew the access token and refresh token',
    description:
      'If the access token is expired, we use the refresh token to renew both the access token and the refresh token',
  })
  @ErrorResponse('common')
  @ErrorResponse('auth.refreshTokens')
  @GetOneSuccessResponse(TokenResponseDto)
  async refreshTokens(@User() user: any) {
    const { id, refreshToken } = user;

    const { data, error } = await this.authService.refreshTokens(
      id,
      refreshToken,
    );

    if (error) {
      throw error;
    }

    return AppResponse.ok(data);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @ApiOperation({
    summary: 'Logout',
    description: 'Revoke a refresh token',
  })
  @ErrorResponse('common')
  @ErrorResponse('auth.logout')
  @GetOneSuccessResponse(null)
  async logout(@User() user: any) {
    const { refreshToken } = user;

    const { data, error } = await this.authService.logout(refreshToken);

    if (error) {
      throw error;
    }

    return AppResponse.ok(data);
  }
}
