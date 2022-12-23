import { HttpException } from '@nestjs/common';
import Collection from './Collection';

export interface SuccessResult<T> {
  err?: null;
  data: T;
}

export interface FailResult {
  err: HttpException;
  data?: null;
}

export type FindOneServiceResult<T> = SuccessResult<T> | FailResult;

export type FindAllSimpleServiceResult<T> = SuccessResult<T[]> | FailResult;

export type FindAllPaginationServiceResult<T> =
  | SuccessResult<Collection<T>>
  | FailResult;

export type CreateServiceResult<T> = SuccessResult<T> | FailResult;

export type UpdateServiceResult<T> = SuccessResult<T> | FailResult;

export type DeleteServiceResult =
  | SuccessResult<Record<string, never>>
  | FailResult;
