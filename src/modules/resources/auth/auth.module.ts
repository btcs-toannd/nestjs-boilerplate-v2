import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';

@Module({
  controllers: [AuthController],
  imports: [PassportModule, JwtModule.register({}), PrismaModule],
  providers: [AuthService, AccessTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
