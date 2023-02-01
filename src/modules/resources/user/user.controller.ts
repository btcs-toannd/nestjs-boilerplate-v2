import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';

import { CreatedSuccessResponse } from 'src/common/decorators/responses/created-success.decorator';
import { DeletedSuccessResponse } from 'src/common/decorators/responses/deleted-success.decorator';
import { GetOneSuccessResponse } from 'src/common/decorators/responses/get-one-success.decorator';
import { PAGE_LIMIT } from 'src/common/constants';
import { InternalServerErrorResponse } from 'src/common/decorators/responses/internal-server-error.decorator';
import { NotFoundErrorResponse } from 'src/common/decorators/responses/not-found-error.decorator';
import { User as UserEntity } from 'src/modules/common/entities/user.entity';
import { PaginatedSuccessResponse } from 'src/common/decorators/responses/paginated-list-success.decorator';
import { UpdatedSuccessResponse } from 'src/common/decorators/responses/updated-success.decorator';
import AppResponse from 'src/common/models/AppResponse';
import Collection from 'src/common/models/Collection';

import { UserService } from './user.service';

@ApiTags('users')
@InternalServerErrorResponse()
// @ApiBearerAuth()
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user', description: 'Create new user' })
  @CreatedSuccessResponse(UserEntity)
  async create(
    @Body() userData: Prisma.UserCreateInput,
  ): Promise<AppResponse<User>> {
    const { data, error } = await this.userService.create(userData);

    if (error) {
      throw error;
    }

    return AppResponse.ok<User>(data);
  }

  @Get()
  @ApiOperation({ summary: 'List users', description: 'List users' })
  @PaginatedSuccessResponse(UserEntity)
  async findAll(): Promise<AppResponse<Collection<User>>> {
    const { data, error } = await this.userService.findAll();

    if (error) {
      throw error;
    }

    const responseData: Collection<User> = {
      edges: data,
      pageInfo: {
        limit: PAGE_LIMIT.ALL,
        offset: 0,
        total: data.length,
      },
    };

    return AppResponse.ok(responseData);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one user with specified ID',
    description: 'Get one user with specified ID',
  })
  @GetOneSuccessResponse(UserEntity)
  @NotFoundErrorResponse()
  async findOne(@Param('id') id: string) {
    const { data, error } = await this.userService.findOne(+id);

    if (error) {
      throw error;
    }

    return AppResponse.ok<User>(data);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update one user with specified ID',
    description: 'Update one user with specified ID',
  })
  @UpdatedSuccessResponse(UserEntity)
  async update(
    @Param('id') id: string,
    @Body() userData: Prisma.UserUpdateInput,
  ) {
    const { data, error } = await this.userService.update(+id, userData);

    if (error) {
      throw error;
    }

    return AppResponse.ok<User>(data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete one user with specified ID',
    description: 'Delete one user with specified ID',
  })
  @DeletedSuccessResponse()
  async remove(@Param('id') id: string) {
    const { data, error } = await this.userService.remove(+id);

    if (error) {
      throw error;
    }

    return AppResponse.ok<User>(data);
  }
}
