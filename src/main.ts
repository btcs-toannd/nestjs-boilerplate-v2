import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from 'src/app.module';
import { AppConfigService } from 'src/configs/app/config.service';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors();

  // Helmet can help protect your app from some well-known web vulnerabilities
  // by setting HTTP headers appropriately
  app.use((helmet as any)());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useLogger(app.get(Logger));

  // swagger OPENAPI
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API docs')
    .setDescription('The API document is generated automatically')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('api', app, document);

  const appConfig: AppConfigService = app.get(AppConfigService);

  await app.listen(appConfig.port);
}
bootstrap();
