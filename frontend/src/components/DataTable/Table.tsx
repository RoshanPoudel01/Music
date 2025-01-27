import { EmptyState } from "@artist/components/ui/empty-state";
import { SkeletonText } from "@artist/components/ui/skeleton";
import { useSearchParamsState } from "@artist/hooks/useSearchParamState";
import { IPagination } from "@artist/services/service-response";
import { Card, CardRootProps, Flex, Icon, Table, Text } from "@chakra-ui/react";
import { ArrowDown, ArrowUp } from "@phosphor-icons/react";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import Pagination from "./Pagination";

interface IDataTable {
  data: Record<string, any>[];
  count?: number;
  children?: ReactNode;
  columns: ColumnDef<any, any>[];
  isLoading?: boolean;
  showPagination?: boolean;
  manualPagination?: boolean;
  pagination?: IPagination;
  filter?: {
    globalFilter: string;
    setGlobalFilter: Dispatch<SetStateAction<string>>;
  };

  handlePageSize?: (pageSize: number) => void;
}

const filterFunction: FilterFn<any> = (rows, id, value) => {
  const rowValue = String(rows.original[id]).toLowerCase();
  const filterStatusValue = value.toLowerCase();
  // return rowValue.includes(filterStatusValue);

  // Split the rowValue by spaces to check for individual words
  const words = rowValue.split(" ");

  // Check if any word starts with the filterValue
  const match = words.some((word) => word.startsWith(filterStatusValue));

  return match;
};

const DataTable: FC<IDataTable & CardRootProps> = ({
  data,
  columns,
  count,
  children,
  isLoading,
  showPagination = true,
  manualPagination = true,
  pagination,
  filter,
  ...rest
  // handlePageSize,
}) => {
  const { pageIndex } = useSearchParamsState();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [page] = useState<number>(1);
  const [pageSize, _] = useState<number>(10);
  const table = useReactTable({
    columns,
    data,
    manualPagination: manualPagination,
    state: {
      columnFilters,
      globalFilter: filter?.globalFilter?.trim() || "",
      pagination: {
        pageIndex,
        pageSize: pagination?.perPage ?? pageSize,
      },
    },

    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: filterFunction,
    onGlobalFilterChange: filter?.setGlobalFilter,
  });

  return (
    <Card.Root {...rest}>
      {children && <Card.Header>{children}</Card.Header>}
      <Card.Body pt={4}>
        <Table.ScrollArea
          borderRadius={5}
          borderWidth={"1px"}
          // border={"1px solid var(--chakra-colors-gray-200)"}
        >
          <Table.Root variant={"outline"} interactive>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => {
                return (
                  <Table.Row key={headerGroup.id} mb={2}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <Table.ColumnHeader
                          colSpan={header.colSpan}
                          key={header.id}
                          textTransform="capitalize"
                          whiteSpace="nowrap"
                          mb={10}
                          style={{
                            width:
                              header.getSize() !== 150
                                ? header.getSize()
                                : "auto",

                            textAlign: "center",
                            padding: "15px",
                            fontWeight: 600,
                          }}
                          // fontFamily={"Inter Variable"}
                          cursor={
                            header.column.getCanSort() ? "pointer" : "default"
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <Flex gap={2} justify={"center"} align={"center"}>
                            <Text textAlign={"center"}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </Text>
                            {header.column.getCanSort() ? (
                              header.column.getIsSorted().valueOf() ===
                              "desc" ? (
                                <Icon asChild boxSize={4}>
                                  <ArrowUp weight="bold" />
                                </Icon>
                              ) : header.column.getIsSorted().valueOf() ===
                                "asc" ? (
                                <Icon asChild boxSize={4}>
                                  <ArrowDown weight="bold" />
                                </Icon>
                              ) : null
                            ) : null}
                          </Flex>
                        </Table.ColumnHeader>
                      );
                    })}
                  </Table.Row>
                );
              })}
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <>
                  {[...Array(5)].map((_, rowIndex) => (
                    <Table.Row key={rowIndex}>
                      {columns.map((_, columnIndex) => (
                        <Table.Cell key={columnIndex}>
                          <SkeletonText
                            noOfLines={1}
                            height="20px"
                            w={"full"}
                          />
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
                </>
              ) : pagination?.total === 0 || data.length === 0 ? (
                <Table.Row>
                  <Table.Cell
                    border={0}
                    colSpan={columns.length}
                    textAlign="center"
                  >
                    <EmptyState
                      title="No data found"
                      description="No data available to show"
                    />
                  </Table.Cell>
                </Table.Row>
              ) : (
                table.getRowModel().rows.map((row) => {
                  return (
                    <Table.Row verticalAlign={"middle"} key={row.id}>
                      {row.getVisibleCells()?.map((cell, index) => {
                        return (
                          <Table.Cell
                            style={{
                              width: `${columns[index]?.maxSize}px`,
                              textAlign: "center",
                              overflow: "clip",
                              textOverflow: "ellipsis",
                            }}
                            borderColor={"gray.300"}
                            key={cell.id}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Table.Cell>
                        );
                      })}
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Card.Body>
      {pagination && (
        <Card.Footer>
          <Pagination
            pageSize={pagination?.perPage}
            count={pagination?.total}
            pageIndex={pageIndex ?? page}
          />
        </Card.Footer>
      )}
    </Card.Root>
  );
};

export default DataTable;
