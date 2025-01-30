import { DataTable } from "@artist/components/DataTable";
import { SearchInput } from "@artist/components/Form";
import { useFetchMusics } from "@artist/services/service-music";
import { IPageParams } from "@artist/services/service-response";
import PageHeader from "@artist/utils/PageHeader";
import { HStack, Stack } from "@chakra-ui/react";
import { useState } from "react";
const Music = () => {
  const [pageParams, setPageParams] = useState<IPageParams>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchText, setSearchText] = useState<string>("");
  const { data: musicData, isLoading: isMusicGetLoading } =
    useFetchMusics(pageParams);
  const columns = [
    {
      header: "S.N",
      cell: ({ row }) =>
        pageParams.pageIndex * pageParams.pageSize + row.index + 1,
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Address",
      accessorKey: "address",
    },
  ];
  return (
    <>
      <PageHeader title="Music" />
      <Stack>
        <DataTable
          columns={columns}
          data={musicData?.data ?? []}
          isLoading={isMusicGetLoading}
          pagination={{
            manual: true,
            pageCount: Number(musicData?.totalItems),
            pageParams: pageParams,
            onChangePagination: setPageParams,
          }}
          filter={{
            globalFilter: searchText,
            setGlobalFilter: setSearchText,
          }}
        >
          <HStack justify={"space-between"}>
            <SearchInput onSearch={setSearchText} />
            <HStack></HStack>
          </HStack>
        </DataTable>
      </Stack>
    </>
  );
};

export default Music;
