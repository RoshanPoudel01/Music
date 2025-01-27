import { Response } from "express";
import { Pagination, Status } from "./type";

interface APIResponseProps<T> {
  res: Response;
  data?: T | null;
  statusCode: number;
  message?: string;
  status: Status;
  pagination?: Pagination;
  token?: string;
  error?: Error | string | string[] | { [key: string]: string[] };
}

export const APIResponse = <T>({
  res,
  data,
  statusCode,
  message,
  status = Status.SUCCESS,
  pagination,
  error,
  token,
}: APIResponseProps<T>): void => {
  const response = {
    data,
    token,
    pagination,
    status,
    statusCode,
    message,
    error,
  };

  res.status(statusCode).send(response);
};
