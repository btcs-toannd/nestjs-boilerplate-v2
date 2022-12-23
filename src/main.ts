import { NestFactory } from '@nestjs/core';

import { AppModule } from 'src/app.module';
import { AppConfigService } from 'src/configs/app/config.service';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  const appConfig: AppConfigService = app.get(AppConfigService);

  // console.log(appConfig.port);
  await app.listen(appConfig.port);
}
bootstrap();
