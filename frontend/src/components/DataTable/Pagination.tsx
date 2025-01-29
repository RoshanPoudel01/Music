import { Box, Center, IconButton, Input, Stack } from "@chakra-ui/react";
import { Table } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface IPagination {
  isBackendPaginated?: boolean;
  pageIndex?: number;
  table: Table<any>;
  pageCount?: number;
}

function Pagination({ isBackendPaginated, pageIndex, table }: IPagination) {
  const [isEditing, setIsEditing] = useState(false);
  const [enteredNumber, setEnteredNumber] = useState("");
  const totalPage = useMemo(() => {
    return table.getPageCount();
  }, [table.getPageCount()]);

  const currentPage = useMemo(() => {
    return isBackendPaginated
      ? (pageIndex ?? 0) + 1
      : table.getState().pagination.pageIndex + 1;
  }, [isBackendPaginated, pageIndex, table.getState().pagination.pageIndex]);

  const PageNumberWrapper = (item: number, isActive?: boolean) => {
    const handleClick = () => {
      if (isActive) {
        setIsEditing(true);
      } else {
        table.setPageIndex(item - 1);
      }
    };
    const handleSubmit = () => {
      const parsedNumber = parseInt(enteredNumber, 10);

      if (!isNaN(parsedNumber) && parsedNumber > 0) {
        table.setPageIndex(parsedNumber - 1);
      }

      setIsEditing(false);
      setEnteredNumber("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEnteredNumber(
        e?.target?.value ?? table.getState().pagination.pageIndex
      );
    };

    if (isEditing && isActive) {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Input
            width={"4ch"}
            height={"4ch"}
            // sx={{ p: 2, m: 0 }}
            type="number"
            value={enteredNumber}
            onChange={handleChange}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        </form>
      );
    }

    return (
      <Center
        h={9}
        w={9}
        bg={isActive ? "gray.500" : "white"}
        borderRadius={20}
        pt={0.5}
        color={isActive ? "white" : "black"}
        _hover={isActive ? {} : { bg: "gray.400", color: "white" }}
        cursor={"pointer"}
        fontSize={"md"}
        userSelect="none"
        onClick={handleClick}
      >
        {item}
      </Center>
    );
  };

  return (
    <Box
      display={"flex"}
      justifyContent="flex-end"
      alignItems={"center"}
      height={"50px"}
    >
      <Box marginX={"16px"}>
        <Stack direction={"row"} alignItems="center" columnGap={0}>
          <IconButton
            variant={"outline"}
            aria-label="First Page"
            borderRadius="10px"
            onClick={() => table.setPageIndex(0)}
            size="xs"
            fontSize={"lg"}
            border={"none"}
            disabled={!table.getCanPreviousPage()}
          >
            <HiOutlineChevronDoubleLeft />
          </IconButton>
          <IconButton
            variant={"outline"}
            aria-label="Previous Page"
            borderRadius="10px"
            onClick={() => table.previousPage()}
            size="xs"
            fontSize={"lg"}
            border={"none"}
            disabled={!table.getCanPreviousPage()}
          >
            <IoIosArrowBack />
          </IconButton>
          {/* {currentPage > 2 && PageNumberWrapper(currentPage - 2)} */}
          {currentPage != 1 && PageNumberWrapper(currentPage - 1)}
          {PageNumberWrapper(currentPage, true)}
          {currentPage < totalPage && PageNumberWrapper(currentPage + 1)}
          {/* {currentPage < totalPage - 1 && PageNumberWrapper(currentPage + 2)} */}
          {totalPage < currentPage - 1 &&
            totalPage - 1 > 0 &&
            PageNumberWrapper(totalPage - 1)}

          <IconButton
            aria-label="Next Page"
            variant={"outline"}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            size="xs"
            fontSize={"lg"}
            border="none"
          >
            <IoIosArrowForward />
          </IconButton>
          <IconButton
            aria-label="Last Page"
            variant={"outline"}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            size="xs"
            fontSize={"lg"}
            border="none"
            // icon={<HiOutlineChevronDoubleRight />}
          >
            <HiOutlineChevronDoubleRight />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}

export default Pagination;
