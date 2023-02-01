import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import AppResponse from 'src/common/models/AppResponse';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw AppResponse.error('common.invalidToken');
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
