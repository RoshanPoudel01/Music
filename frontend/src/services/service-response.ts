import { Row } from "@tanstack/react-table";

export interface IPagination {
  currentPage: number;
  perPage: number;
  lastPage: number;
  total: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string;
  prevPageUrl: string;
}

export interface PaginationProps {
  page: number;
  perPage: number;
}
export interface IRow<T> {
  row: Row<T>;
}

export interface RootInterface<T> {
  data: T[];
  status: number;
  statusCode: number;
  message: string;
}

export interface SingleResponse<T> {
  message?: string;
  status?: boolean;
  data: T;
}
