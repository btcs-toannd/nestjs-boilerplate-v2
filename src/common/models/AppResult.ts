export interface SuccessResult<T> {
  err?: never;
  data: T;
  cautions?: string[];
}

export interface FailResult<T> {
  err: T;
  data?: never;
  cautions?: string[];
}

export type AppResult<T, K> = SuccessResult<T> | FailResult<K>;
