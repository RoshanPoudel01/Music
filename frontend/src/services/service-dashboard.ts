import { api } from "./service-api";
import { useFetch } from "./service-form-methods";
import { RootInterface } from "./service-response";
export interface DashboardInterface {
  artist_count: string;
  music_count: string;
  user_count: string;
}
const useFetchDashboard = () => {
  return useFetch<RootInterface<DashboardInterface>>({
    url: api.dashboard.index,
    queryKey: ["artists"],
  });
};
export { useFetchDashboard };
