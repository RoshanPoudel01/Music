export enum Status {
  SUCCESS = 1,
  FAILURE = 0,
}

export interface RootResponse<T> {
  data: T | null;
  token?: string;
  pagination?: Pagination;
  status: Status;
  statusCode: number;
  message: string;

  error?: string | string[] | { [key: string]: string[] };
}

export interface Pagination {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  firstPage: string;
  lastPage: string;
}
