import { Injectable, Logger } from '@nestjs/common';

import AppResponse from 'src/common/models/AppResponse';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor() {
    // Optionally you can set context for logger in constructor or ...
    // this.logger.setContext(UserService.name);
  }

  create() {
    return 'This action adds a new user';
  }

  findAll() {
    this.logger.warn({ foo: 'bar', fos: 'baz' });
    this.logger.error('soo');
    this.logger.verbose({ foo: 'bar' }, 'baz %s', 'qux');
    this.logger.debug('foo %s %o', 'bar', { baz: 'qux' });
    throw AppResponse.badRequest(['errrer']);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  // eslint-disable-next-line class-methods-use-this
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
