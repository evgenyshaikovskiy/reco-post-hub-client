export interface IPaginatedData<T> {
  totalItems: number;
  items: T[];
  page: number;
  size: number;
}

export interface IPagination {
  page: number;
  size: number;
}


export interface IFilteringParams {
  property: string;
  rule: FilterRule;
  value: string;
}

export interface ISortingParams {
  property: string;
  direction: 'asc' | 'desc';
}

export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
}