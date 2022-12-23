/* eslint-disable import/no-extraneous-dependencies */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import AppResponse from 'src/common/models/AppResponse';
import { CustomRequest } from 'src/common/models/CustomRequest';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  // eslint-disable-next-line class-methods-use-this
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      // Middleware logic

      next();
    } catch (error) {
      throw AppResponse.authenticationFailed([error.message], 1000);
    }
  }
}
