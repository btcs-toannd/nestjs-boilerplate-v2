import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { LoggerModule } from 'configs/logger/logger.module';
import { AppConfigModule } from 'configs/app/config.module';
import { DatabaseConfigModule } from 'configs/database/database.module';
import { AuthModule } from 'src/modules/resources/auth/auth.module';
import { UserModule } from 'src/modules/resources/user/user.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AppConfigModule,
    DatabaseConfigModule,
    LoggerModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
