import { HttpException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';

import AppResponse from 'src/common/models/AppResponse';
import { AppResult } from 'src/common/models/AppResult';
import { JwtPayload } from 'src/modules/resources/auth/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashToken } from 'src/utils';

import { LoginBodyDto } from './dto/login-dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly LOGGER_PREFIX = 'Auth service caught error in ';

  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(loginData: LoginBodyDto): Promise<AppResult<any, HttpException>> {
    try {
      const { username, password } = loginData;
      const user = await this.prisma.user.findUnique({ where: { username } });

      if (!user) {
        return { err: AppResponse.error('auth.login.incorrect') };
      }

      // TODO: Better using decrypted password
      if (user.password !== password) {
        return { err: AppResponse.error('auth.login.incorrect') };
      }

      const payload: JwtPayload = {
        id: user.id,
      };

      const refreshTokenExpiresIn = Number(process.env.REFRESH_TOKEN_LIFE);
      const refreshTokenExpireAt = new Date(Date.now() + refreshTokenExpiresIn);

      const accessTokenExpiresIn = Number(process.env.ACCESS_TOKEN_LIFE);

      const { hashedRefreshToken, tokens } = await this.generateTokens(payload);

      await this.prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: hashedRefreshToken,
          expireAt: refreshTokenExpireAt,
        },
      });

      return {
        data: {
          ...tokens,
          tokenType: 'bearer',
          expireIn: accessTokenExpiresIn,
        },
      };
    } catch (error) {
      this.logger.error(
        `${this.LOGGER_PREFIX} method "login": ${error.message}`,
      );

      return { err: AppResponse.error('common.serverError') };
    }
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          error: AppResponse.error('auth.refreshTokens.unauthorized'),
        };
      }

      const payload: JwtPayload = {
        id: user.id,
      };

      const refreshTokenExpiresIn = Number(process.env.REFRESH_TOKEN_LIFE);
      const refreshTokenExpireAt = new Date(Date.now() + refreshTokenExpiresIn);

      const accessTokenExpiresIn = Number(process.env.ACCESS_TOKEN_LIFE);

      const { hashedRefreshToken, tokens } = await this.generateTokens(payload);

      await this.prisma.$transaction([
        this.prisma.refreshToken.create({
          data: {
            userId: user.id,
            token: hashedRefreshToken,
            expireAt: refreshTokenExpireAt,
          },
        }),
        this.prisma.refreshToken.delete({ where: { token: refreshToken } }),
      ]);

      return {
        data: {
          ...tokens,
          tokenType: 'bearer',
          expireIn: accessTokenExpiresIn,
        },
      };
    } catch (error) {
      this.logger.error(
        `${this.LOGGER_PREFIX} method "refreshTokens": ${error.message}`,
      );

      return { error: AppResponse.error('common.serverError') };
    }
  }

  async logout(refreshToken: string): Promise<any> {
    try {
      await this.prisma.refreshToken.delete({ where: { token: refreshToken } });

      return {
        data: null,
      };
    } catch (error) {
      this.logger.error(
        `${this.LOGGER_PREFIX} method "logout": ${error.message}`,
      );

      return { error: AppResponse.error('common.serverError') };
    }
  }

  async generateTokens(payload: JwtPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_LIFE,
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    });

    // The longer the token, the more difficult it is to brute-force attack
    const refreshToken = nanoid(64);

    const hashedRefreshToken = hashToken(refreshToken);

    return {
      hashedRefreshToken,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }
}
