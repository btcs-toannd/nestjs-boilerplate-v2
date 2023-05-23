import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './database.config';
import { ReadonlyDatabaseConfigService } from './database.service';
import { validate } from './database.validation';

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate,
    }),
  ],
  providers: [ConfigService, ReadonlyDatabaseConfigService],
  exports: [ConfigService, ReadonlyDatabaseConfigService],
})
export class ReadonlyDatabaseConfigModule {}
