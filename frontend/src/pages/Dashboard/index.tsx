import DashboardCard from "@artist/components/DashboardCard";
import { useFetchDashboard } from "@artist/services/service-dashboard";
import PageHeader from "@artist/utils/PageHeader";
import { SimpleGrid } from "@chakra-ui/react";
import { NAVIGATION_ROUTES } from "../App/navigationRoutes";

const Home = () => {
  const { data } = useFetchDashboard();
  return (
    <>
      <PageHeader title="Dashboard" description="Welcome to the dashboard" />
      <SimpleGrid columns={4} gap={10}>
        <DashboardCard
          title="Total Users"
          data={data?.data?.user_count ?? 0}
          href={NAVIGATION_ROUTES.USERS}
        />
        <DashboardCard
          title="Total Artists"
          data={data?.data?.artist_count ?? 0}
          href={NAVIGATION_ROUTES.ARTISTS}
        />
      </SimpleGrid>
    </>
  );
};

export default Home;
