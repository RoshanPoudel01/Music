import { Row } from "@tanstack/react-table";

export interface IPagination {
  currentPage: number;
  perPage: number;
  total: number;
}

export interface IPageParams {
  pageIndex: number;
  pageSize: number;
}
export interface IRow<T> {
  row: Row<T>;
}

export interface RootInterface<T> {
  data: T[];
  status: number;
  statusCode: number;
  message: string;
  totalItems: string;
}

export interface SingleResponse<T> {
  message?: string;
  status?: boolean;
  data: T;
}
