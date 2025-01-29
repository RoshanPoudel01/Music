import { DataTable } from "@artist/components/DataTable";
import { IPageParams, IRow } from "@artist/services/service-response";
import { useFetchUsers, UserResponse } from "@artist/services/service-user";
import PageHeader from "@artist/utils/PageHeader";
import { Button, Stack } from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
const Users = () => {
  const [pageParams, setPageParams] = useState<IPageParams>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data: usersData, isLoading: isUserGetLoading } =
    useFetchUsers(pageParams);
  const columns = [
    {
      header: "S.N",
      cell: ({ row }: IRow<UserResponse>) =>
        pageParams.pageIndex * pageParams.pageSize + row.index + 1,
    },
    {
      header: "Name",
      accessorKey: "firstName",
      cell: ({ row }: IRow<UserResponse>) =>
        `${row.original.first_name} ${row.original.last_name}`,
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Address",
      accessorKey: "address",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "DOB",
      accessorKey: "dob",
      cell: ({ row }: IRow<UserResponse>) => {
        return moment(row.original.dob).format("YYYY/MM/DD");
      },
    },
  ];

  return (
    <>
      <PageHeader title="Users" />
      <Stack>
        <Button marginLeft={"auto"} w={"max-content"}>
          Add Users
        </Button>
        <DataTable
          columns={columns}
          data={usersData?.data ?? []}
          isLoading={isUserGetLoading}
          pagination={{
            manual: true,
            pageCount: Number(usersData?.totalItems),
            pageParams: pageParams,
            onChangePagination: setPageParams,
          }}
        />
      </Stack>
    </>
  );
};

export default Users;
