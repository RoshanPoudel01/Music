import { api } from "./service-api";
import { useFetch, useMutate } from "./service-form-methods";
import { IPageParams, RootInterface, SingleResponse } from "./service-response";
export interface ArtistResponse {
  id: number;
  name: string;
  dob?: string;
  gender: string;
  address: string;
  first_release_year: number;
  no_of_albums_released: number;
  created_at: string;
  updated_at: string;
}
const useFetchArtists = ({
  pageParams,
  searchParam,
}: {
  pageParams: IPageParams;
  searchParam: string;
}) => {
  return useFetch<RootInterface<ArtistResponse[]>>({
    url: api.artists.index,
    queryKey: ["artists", pageParams, searchParam],
    pageParams,
    searchParam,
  });
};

const useFetchArtist = (id: number, enabled: boolean) => {
  return useFetch<SingleResponse<ArtistResponse>>({
    url: api.artists.byId.replace(":id", id + ""),
    queryKey: ["artists", id],
    enabled: !!id && enabled,
  });
};

const useAddArtist = () => {
  return useMutate({
    url: api.artists.create,
    invalidates: ["artists"],
    message: "Artist added successfully",
  });
};

const useDeleteArtist = () => {
  return useMutate({
    url: api.artists.delete,
    invalidates: ["artists"],
    message: "Artist deleted successfully",
    method: "DELETE",
  });
};

const useUploadArtist = () => {
  return useMutate({
    url: api.artists.bulkUpload,
    invalidates: ["artists"],
    message: "Artist uploaded successfully",
  });
};
export {
  useAddArtist,
  useDeleteArtist,
  useFetchArtist,
  useFetchArtists,
  useUploadArtist,
};
