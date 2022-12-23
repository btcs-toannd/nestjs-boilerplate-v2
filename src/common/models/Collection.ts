import PageInfo from './PageInfo';

export default interface Collection<T> {
  edges: T[];
  pageInfo: PageInfo;
}
