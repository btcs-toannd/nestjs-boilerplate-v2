import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as crypto from 'crypto';

import AppResponse from 'src/common/models/AppResponse';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.query?.refresh_token) {
      throw AppResponse.error('auth.refreshTokens.unauthorized');
    }

    const refreshToken = request.query.refresh_token;

    const hash = crypto
      .createHmac('sha256', process.env.REFRESH_TOKEN_SECRET)
      .update(refreshToken)
      .digest('hex');

    let result;
    try {
      result = await this.prisma.refreshToken.findUnique({
        where: { token: hash },
      });
    } catch {
      throw AppResponse.error('common.serverError');
    }

    if (!result || result.token !== hash) {
      throw AppResponse.error('auth.refreshTokens.unauthorized');
    }

    const expireTime = new Date(result.expireAt).getTime();
    const currentTime = Date.now();

    if (currentTime > expireTime) {
      throw AppResponse.error('auth.refreshTokens.unauthorized');
    }

    request.user = {
      id: result.userId,
      refreshToken: result.token,
    };

    return true;
  }
}
