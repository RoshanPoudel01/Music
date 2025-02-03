import { api } from "./service-api";
import { useFetch, useMutate } from "./service-form-methods";
import { IPageParams, RootInterface, SingleResponse } from "./service-response";
export interface MusicResponse {
  id: number;
  title: string;
  album_name: string;
  genre: string;
  artist_name: string;
}
const useFetchMusics = ({
  pageParams,
  id,
  searchParam,
}: {
  pageParams: IPageParams;
  id: number;
  searchParam: string;
}) => {
  return useFetch<RootInterface<MusicResponse[]>>({
    url: api.music.index?.replace(":id", id + ""),
    queryKey: ["music", pageParams, id, searchParam],
    pageParams,
    searchParam,
  });
};

const useFetchMusic = (id: number, enabled: boolean) => {
  return useFetch<SingleResponse<MusicResponse>>({
    url: api.music.byId.replace(":id", id + ""),
    queryKey: ["music", id],
    enabled: !!id && enabled,
  });
};

const useAddMusic = () => {
  return useMutate({
    url: api.music.create,
    invalidates: ["music"],
    message: "Music added successfully",
  });
};

const useDeleteMusic = () => {
  return useMutate({
    url: api.music.delete,
    invalidates: ["music"],
    message: "Music deleted successfully",
    method: "DELETE",
  });
};

export { useAddMusic, useDeleteMusic, useFetchMusic, useFetchMusics };
