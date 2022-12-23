import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from 'configs/logger/logger.config';
import { LoggerService } from 'configs/logger/logger.service';
import { validate } from 'configs/logger/logger.validation';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { DestinationStream } from 'pino';
import { Options } from 'pino-http';
import { PrettyOptions } from 'pino-pretty';

const getPinoHttpOptions = (
  options,
):
  | Options
  | DestinationStream
  | [opts: Options, stream: DestinationStream] => ({
  level: options.level,
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: join(__dirname, 'pino-pretty-transport'),
          options: {
            colorize: true,
          } as PrettyOptions,
        }
      : undefined,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    }
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    if (res.statusCode >= 300 && res.statusCode < 400) {
      return 'silent';
    }
    return 'info';
  },
  customReceivedMessage: (req) => `Request received: ${req.method} ${req.url}`,
  customSuccessMessage: (req, res) => {
    if (res.statusCode === 404) {
      return `Resource not found on request ${req.method} ${req.url}`;
    }
    return `Request ${req.method} ${req.url} completed with status code: ${res.statusCode}`;
  },
  customErrorMessage: (req, res, err) => {
    console.log(err);
    return `Request ${req.method} ${req.url} errored with status code: ${res.statusCode}`;
  },
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
  },
});

/**
 *
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate,
      cache: true,
    }),
    PinoLoggerModule.forRootAsync({
      imports: [LoggerModule],
      inject: [LoggerService],
      useFactory: (loggerService: LoggerService) => {
        return {
          pinoHttp: getPinoHttpOptions({ level: loggerService.level }),
        };
      },
    }),
  ],
  providers: [ConfigService, LoggerService],
  exports: [ConfigService, LoggerService],
})
export class LoggerModule {}
