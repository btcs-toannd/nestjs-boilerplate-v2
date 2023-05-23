import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ReadonlyDatabaseConfigService } from 'configs/database/readonly/database.service';
import { camelCase } from 'lodash';
import { minimatch } from 'minimatch';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonlyInstance: PrismaClient;

  constructor(
    private readonlyDatabaseConfigService: ReadonlyDatabaseConfigService,
  ) {
    super();

    this.readonlyInstance = new PrismaClient({
      datasources: { db: { url: this.readonlyDatabaseConfigService.url } },
    });
  }

  async onModuleInit() {
    await this.$connect();
    await this.readonlyInstance.$connect();

    this.$use(async (params, next) => {
      if (minimatch(params.action, '+(find*|count|aggregate|query*)')) {
        const res = await this.readonlyInstance[camelCase(params.model)][
          params.action
        ](params.args);
        return res;
      }
      const result = await next(params);
      return result;
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.readonlyInstance.$disconnect();
  }
}
