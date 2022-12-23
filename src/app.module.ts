import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { LoggerModule } from 'configs/logger/logger.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './configs/app/config.module';
import { DatabaseConfigModule } from './configs/database/database.module';
import { UserModule } from './models/user/user.module';
import { GroupModule } from './models/group/group.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';

@Module({
  imports: [
    AppConfigModule,
    DatabaseConfigModule,
    LoggerModule,
    UserModule,
    GroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
