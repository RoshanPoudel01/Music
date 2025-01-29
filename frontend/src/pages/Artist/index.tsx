import { DataTable } from "@artist/components/DataTable";
import {
  ArtistResponse,
  useFetchArtists,
} from "@artist/services/service-artist";
import { IPageParams, IRow } from "@artist/services/service-response";
import { ExportCSV } from "@artist/utils/Export";
import PageHeader from "@artist/utils/PageHeader";
import { Button, HStack, Stack } from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
const Artist = () => {
  const [pageParams, setPageParams] = useState<IPageParams>({
    pageIndex: 0,
    pageSize: 10,
  });
  const {
    data: artistData,
    isLoading: isUserGetLoading,
    refetch,
  } = useFetchArtists(pageParams);
  const columns = [
    {
      header: "S.N",
      cell: ({ row }: IRow<ArtistResponse>) =>
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
    {
      header: "First Release Year",
      accessorKey: "first_release_year",
    },
    {
      header: "No of Albums Released",
      accessorKey: "no_of_albums_released",
    },
    {
      header: "Gender",
      accessorKey: "gender",
      cell: ({ row }: IRow<ArtistResponse>) => {
        return row.original.gender.toUpperCase();
      },
    },
    {
      header: "DOB",
      accessorKey: "dob",
      cell: ({ row }: IRow<ArtistResponse>) => {
        return (
          row.original.dob && moment(row.original.dob).format("YYYY/MM/DD")
        );
      },
    },
  ];

  const columnHeading = {
    sn: "S.N.",
    name: "Name",
    address: "Address",
    first_release_year: "First Release Year",
    no_of_albums_released: "No of Albums Released",
    gender: "Gender",
  };

  const getFullData = async () => {
    setPageParams({ pageIndex: 0, pageSize: Number(artistData?.totalItems) });
    const response = await refetch();
    const data = response?.data?.data?.map((item: any, index) => {
      return {
        sn: `${index + 1}`,
        name: item?.name,
        address: item?.address,
        first_release_year: item?.first_release_year,
        no_of_albums_released: item?.no_of_albums_released
          ? item?.no_of_albums_released
          : 0,
        gender: item?.gender,
      };
    });
    return data;
  };
  const handleExport = async () => {
    const data = await getFullData();
    ExportCSV({
      fileName: "Artists",
      exportTitle: "Artists",
      csvData: data,
      Heading: [columnHeading],
      header: Object.keys(columnHeading),
    });
  };
  return (
    <>
      <PageHeader title="Artists" />
      <Stack>
        <HStack>
          <Button marginLeft={"auto"} w={"max-content"} onClick={handleExport}>
            Import
          </Button>
          <Button marginLeft={"auto"} w={"max-content"} onClick={handleExport}>
            Export
          </Button>
          <Button marginLeft={"auto"} w={"max-content"}>
            Add Artist
          </Button>
        </HStack>
        <DataTable
          columns={columns}
          data={artistData?.data ?? []}
          isLoading={isUserGetLoading}
          pagination={{
            manual: true,
            pageCount: Number(artistData?.totalItems),
            pageParams: pageParams,
            onChangePagination: setPageParams,
          }}
        />
      </Stack>
    </>
  );
};

export default Artist;
