import { DataTable } from "@artist/components/DataTable";
import { IRow } from "@artist/services/service-response";
import { useFetchUsers, UserResponse } from "@artist/services/service-user";
import PageHeader from "@artist/utils/PageHeader";

const Home = () => {
  const columns = [
    {
      header: "Name",
      accessorKey: "firstName",
      cell: ({ row }: IRow<UserResponse>) =>
        `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      header: "Email",
      accessorKey: "email",
    },
  ];

  const { data } = useFetchUsers();

  return (
    <>
      <PageHeader title="Dashboard" description="Welcome to the dashboard" />
      <DataTable columns={columns} data={data?.data ?? []} />
    </>
  );
};

export default Home;
