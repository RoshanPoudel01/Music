import { api } from "./service-api";
import { useFetch, useMutate } from "./service-form-methods";
import { IPageParams, RootInterface, SingleResponse } from "./service-response";
export interface MusicResponse {
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
const useFetchMusics = (pageParams: IPageParams) => {
  return useFetch<RootInterface<MusicResponse[]>>({
    url: api.music.index,
    queryKey: ["music", pageParams],
    pageParams,
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
