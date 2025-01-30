import { DataTable } from "@artist/components/DataTable";
import { SearchInput } from "@artist/components/Form";
import { DeleteAlert } from "@artist/components/Form/Modal";
import { Button } from "@artist/components/ui/button";
import {
  MusicResponse,
  useDeleteMusic,
  useFetchMusics,
} from "@artist/services/service-music";
import { IPageParams, IRow } from "@artist/services/service-response";
import PageHeader from "@artist/utils/PageHeader";
import { Heading, HStack, Icon, IconButton, Stack } from "@chakra-ui/react";
import { Pencil, Plus } from "@phosphor-icons/react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import MusicForm from "./Form";
const Music = () => {
  const [pageParams, setPageParams] = useState<IPageParams>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchText, setSearchText] = useState<string>("");
  const { data: musicData, isLoading: isMusicGetLoading } =
    useFetchMusics(pageParams);

  const [searchParams] = useSearchParams();
  const artistName = searchParams.get("name");
  const { mutateAsync: deleteMusic, isPending: isDeleting } = useDeleteMusic();

  const columns = [
    {
      header: "S.N",
      cell: ({ row }: IRow<MusicResponse>) =>
        pageParams.pageIndex * pageParams.pageSize + row.index + 1,
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Genre",
      accessorKey: "genre",
    },

    {
      header: "Album Name",
      accessorKey: "album_name",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }: IRow<MusicResponse>) => {
        const { id } = row.original;
        return (
          <HStack>
            <MusicForm
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
              isDeleteLoading={isDeleting}
              heading="Delete Artist"
              description="Are you sure you want to delete this artist?"
              onConfirm={async () => {
                try {
                  await deleteMusic({ id });
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
          <Stack>
            <Heading textAlign={"center"} size="md">
              {`Music by ${artistName}`}
            </Heading>
            <HStack justify={"space-between"}>
              <SearchInput onSearch={setSearchText} />
              <HStack>
                <MusicForm
                  trigger={
                    <Button>
                      <Plus size={32} />
                      Add Music
                    </Button>
                  }
                />
              </HStack>
            </HStack>
          </Stack>
        </DataTable>
      </Stack>
    </>
  );
};

export default Music;
