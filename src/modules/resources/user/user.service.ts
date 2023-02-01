import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import AppResponse from 'src/common/models/AppResponse';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly LOGGER_PREFIX = 'UserService caught error in ';

  constructor(private prisma: PrismaService) {}

  async create(userData: Prisma.UserCreateInput) {
    try {
      const user = await this.prisma.user.create({ data: userData });

      return { data: user };
    } catch (error) {
      this.logger.error(`${this.LOGGER_PREFIX} method "create"`);
      this.logger.debug(error);

      return { error: AppResponse.internalServerError([error.message]) };
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();

      return { data: users };
    } catch (error) {
      this.logger.error(`${this.LOGGER_PREFIX} method "findAll"`);
      this.logger.debug(error);

      return { error: AppResponse.internalServerError([error.message]) };
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      return { data: user };
    } catch (error) {
      this.logger.error(`${this.LOGGER_PREFIX} method "findOne"`);
      this.logger.debug(error);

      return { error: AppResponse.internalServerError([error.message]) };
    }
  }

  async update(id: number, userData: Prisma.UserUpdateInput) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: userData,
      });

      return { data: user };
    } catch (error) {
      this.logger.error(`${this.LOGGER_PREFIX} method "update"`);
      this.logger.debug(error);

      return { error: AppResponse.internalServerError([error.message]) };
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.user.delete({ where: { id } });

      return { data: null };
    } catch (error) {
      this.logger.error(`${this.LOGGER_PREFIX} method "remove"`);
      this.logger.debug(error);

      return { error: AppResponse.internalServerError([error.message]) };
    }
  }
}
