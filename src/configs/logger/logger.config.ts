import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { DestinationStream } from 'pino';
import { Options } from 'pino-http';
import { PrettyOptions } from 'pino-pretty';

export function getPinoHttpOptions(
  options,
): Options | DestinationStream | [opts: Options, stream: DestinationStream] {
  return {
    level: 'trace',
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
    customReceivedMessage: (req) =>
      `Request received: ${req.method} ${req.url}`,
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
  };
}

export default registerAs('logger', () => ({
  level: process.env.LOGGER_LEVEL,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  port: process.env.APP_PORT || 3000,
}));
