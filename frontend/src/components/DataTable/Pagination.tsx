import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
  PaginationRootProps,
} from "@artist/components/ui/pagination";
import { Button, HStack } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface PaginationProps {
  pageIndex: number;
  count: number;
  pageSize?: number;
}

const Pagination: FC<PaginationProps & PaginationRootProps> = ({
  pageIndex,
  count,
  pageSize = 10,
  ...rest
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scroll({ top: 0, behavior: "smooth" });
  }, [pageIndex]);
  return (
    <PaginationRoot
      count={count}
      pageSize={pageSize}
      defaultPage={1}
      page={pageIndex}
      onPageChange={(e) => {
        navigate(`?page=${e.page}`);
      }}
      variant="solid"
      w={"full"}
      {...rest}
    >
      <HStack w={"full"} justify={"space-between"} gap={4} flexWrap={"wrap"}>
        <PaginationPageText format="long" />
        <HStack>
          <PaginationPrevTrigger />
          <HStack hideBelow={"1000px"}>
            <PaginationItems />
          </HStack>
          <HStack hideFrom={"1000px"}>
            <Button size={rest.size ?? "sm"}>{pageIndex}</Button>
          </HStack>
          <PaginationNextTrigger />
        </HStack>
      </HStack>
    </PaginationRoot>
  );
};

export default Pagination;
