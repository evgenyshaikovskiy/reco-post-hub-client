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
