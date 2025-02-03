import { DataTable } from "@artist/components/DataTable";
import { SearchInput } from "@artist/components/Form";
import { DeleteAlert } from "@artist/components/Form/Modal";
import { IPageParams, IRow } from "@artist/services/service-response";
import {
  useDeleteUser,
  useFetchUsers,
  UserResponse,
} from "@artist/services/service-user";
import { useInitDataStore } from "@artist/store";
import PageHeader from "@artist/utils/PageHeader";
import { Button, HStack, Icon, IconButton, Stack } from "@chakra-ui/react";
import { Pencil, Plus } from "@phosphor-icons/react";
import moment from "moment";
import { useState } from "react";
import UserForm from "./Form";
const Users = () => {
  const [pageParams, setPageParams] = useState<IPageParams>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { initData } = useInitDataStore();
  const [searchText, setSearchText] = useState<string>("");

  const { data: usersData, isLoading: isUserGetLoading } = useFetchUsers({
    pageParams,
    searchParam: searchText,
  });
  const { mutateAsync: deleteUser, isPending } = useDeleteUser();

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
    {
      header: "Action",
      cell: ({ row }: IRow<UserResponse>) => {
        const { id } = row.original;

        return (
          <HStack>
            <UserForm
              rowId={id}
              trigger={
                <IconButton
                  size={"sm"}
                  variant={"subtle"}
                  colorPalette={"blue"}
                >
                  <Icon boxSize={6} asChild>
                    <Pencil />
                  </Icon>
                </IconButton>
              }
            />
            {/* Cannot delete logged in user */}
            {id != initData?.id && (
              <DeleteAlert
                isDeleteLoading={isPending}
                heading="Delete User"
                description="Are you sure you want to delete this user?"
                onConfirm={async () => {
                  try {
                    await deleteUser({ id });
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            )}
          </HStack>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader title="Users" />
      <Stack>
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
        >
          <HStack>
            <SearchInput onSearch={setSearchText} />

            <UserForm
              trigger={
                <Button colorScheme="teal">
                  <Plus size={32} />
                  Add User
                </Button>
              }
            />
          </HStack>
        </DataTable>
      </Stack>
    </>
  );
};

export default Users;
