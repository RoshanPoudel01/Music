import { Card } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
interface IDashboardCard {
  title: string;
  data: string | number;
  href: string;
}
const DashboardCard = ({ title, data, href }: IDashboardCard) => {
  const navigate = useNavigate();
  return (
    <Card.Root
      cursor={"pointer"}
      width="320px"
      variant={"elevated"}
      onClick={() => navigate(href)}
    >
      <Card.Body gap="1">
        <Card.Title>{title}</Card.Title>
        <Card.Description>{data}</Card.Description>
      </Card.Body>
    </Card.Root>
  );
};

export default DashboardCard;
