import { PAGE_LIMIT } from '../constants';

export default interface PageInfo {
  limit: number | PAGE_LIMIT;
  offset: number;
  total: number;
}
