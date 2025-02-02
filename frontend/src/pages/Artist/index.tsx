import { DataTable } from "@artist/components/DataTable";
import { SearchInput } from "@artist/components/Form";
import { DeleteAlert } from "@artist/components/Form/Modal";
import { Tooltip } from "@artist/components/ui/tooltip";
import {
  ArtistResponse,
  useDeleteArtist,
  useFetchArtists,
} from "@artist/services/service-artist";
import { IPageParams, IRow } from "@artist/services/service-response";
import { ExportCSV } from "@artist/utils/Export";
import PageHeader from "@artist/utils/PageHeader";
import { Button, HStack, Icon, IconButton, Stack } from "@chakra-ui/react";
import {
  DownloadSimple,
  Eye,
  Pencil,
  Plus,
  UploadSimple,
} from "@phosphor-icons/react";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NAVIGATION_ROUTES } from "../App/navigationRoutes";
import BulkUpload from "./BulkUpload";
import ArtistForm from "./Form";
const Artist = () => {
  const [pageParams, setPageParams] = useState<IPageParams>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { mutateAsync: deleteArtist, isPending } = useDeleteArtist();
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();
  const {
    data: artistData,
    isLoading: isArtistGetLoading,
    refetch,
  } = useFetchArtists({
    pageParams,
    searchParam: searchText,
  });
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
    {
      header: "Action",
      cell: ({ row }: IRow<ArtistResponse>) => {
        const { id } = row.original;

        return (
          <HStack>
            <Tooltip
              content="View Artist Music"
              closeDelay={100}
              positioning={{
                placement: "top",
              }}
            >
              <IconButton
                size={"sm"}
                variant={"subtle"}
                colorPalette={"teal"}
                onClick={() =>
                  navigate(
                    NAVIGATION_ROUTES.ARTISTS +
                      `/${id}/music?name=${row.original.name}`
                  )
                }
              >
                <Icon boxSize={6} asChild>
                  <Eye />
                </Icon>
              </IconButton>
            </Tooltip>

            <ArtistForm
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

            <DeleteAlert
              isDeleteLoading={isPending}
              heading="Delete Artist"
              description="Are you sure you want to delete this artist?"
              onConfirm={async () => {
                try {
                  await deleteArtist({ id });
                } catch (error) {
                  console.error(error);
                }
              }}
            />
          </HStack>
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
        <DataTable
          columns={columns}
          data={artistData?.data ?? []}
          isLoading={isArtistGetLoading}
          pagination={{
            manual: true,
            pageCount: Number(artistData?.totalItems),
            pageParams: pageParams,
            onChangePagination: setPageParams,
          }}
          // filter={{
          //   globalFilter: searchText,
          //   setGlobalFilter: setSearchText,
          // }}
        >
          <HStack justify={"space-between"}>
            <SearchInput onSearch={setSearchText} />
            <HStack>
              <BulkUpload
                trigger={
                  <Button w={"max-content"}>
                    <UploadSimple size={32} />
                    Bulk Upload
                  </Button>
                }
              />

              <Button w={"max-content"} onClick={handleExport}>
                <DownloadSimple size={32} /> Export
              </Button>
              <ArtistForm
                trigger={
                  <Button w={"max-content"}>
                    <Plus size={32} />
                    Add Artist
                  </Button>
                }
              />
            </HStack>
          </HStack>
        </DataTable>
      </Stack>
    </>
  );
};

export default Artist;
