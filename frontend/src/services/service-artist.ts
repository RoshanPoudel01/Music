import { api } from "./service-api";
import { useFetch } from "./service-form-methods";
import { IPageParams, RootInterface } from "./service-response";
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
const useFetchArtists = (pageParams: IPageParams) => {
  return useFetch<RootInterface<ArtistResponse[]>>({
    url: api.artists.index,
    queryKey: ["artists", pageParams],
    pageParams,
  });
};

export { useFetchArtists };
