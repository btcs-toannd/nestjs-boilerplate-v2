import { Module } from '@nestjs/common';
import { ReadonlyDatabaseConfigModule } from 'configs/database/readonly/database.module';

import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [ReadonlyDatabaseConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
