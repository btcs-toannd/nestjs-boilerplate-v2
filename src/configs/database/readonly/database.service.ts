import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with database config.
 *
 * @class
 */
@Injectable()
export class ReadonlyDatabaseConfigService {
  constructor(private configService: ConfigService) {}

  get url(): string {
    return this.configService.get<string>('readonlyDatabase.url');
  }
}
