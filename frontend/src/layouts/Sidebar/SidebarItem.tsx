import {
  Collapsible,
  ConditionalValue,
  Flex,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { CaretRight } from "@phosphor-icons/react";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface IItemProps {
  title: string;
  to: string;
  icon?: ReactNode;
}

interface ISidebarItemProps {
  item: IItemProps;
  subItems?: IItemProps[];
  onClick?: () => void;
  activeBg?: ConditionalValue<string>;
  activeColor?: ConditionalValue<string>;
}

const SidebarItem: FC<ISidebarItemProps> = ({
  item,
  subItems,
  onClick,
  activeBg,
}: ISidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const attributes = {
    borderRadius: 5,
    align: "center",
    _hover: {
      bg: activeBg ?? "gray.800",
      color: "white",
    },
  };

  const active = {
    bg: activeBg ?? "gray.800",
    fontWeight: 500,
    color: "white",
  };
  const { pathname } = useLocation();

  // Determine if any subitem matches the current path
  const isSubItemActive = useMemo(() => {
    return subItems?.some((subItem) => pathname.includes(subItem.to)) ?? false;
  }, [pathname, subItems]);

  // Update the `isOpen` state if the parent or subitem is active
  useEffect(() => {
    setIsOpen(pathname.includes(item.to) || isSubItemActive);
  }, [pathname, item.to, isSubItemActive]);

  return !!subItems && subItems.length > 0 ? (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
      defaultOpen={isOpen}
    >
      <Collapsible.Trigger asChild>
        <Flex
          bg={isSubItemActive ? (activeBg ?? "gray.800") : "transparent"}
          p={2}
          fontWeight={
            pathname.includes(item.to.split("/")[3]) || isOpen ? 500 : "normal"
          }
          justify={item.icon ? "space-between" : "center"}
          cursor={"pointer"}
          color={isSubItemActive ? "white" : ""}
          {...attributes}
        >
          <Flex align={"center"} gap={2}>
            <Icon asChild boxSize={5}>
              {item.icon}
            </Icon>
            <Text fontSize={{ base: "16px", md: "18px" }} whiteSpace={"nowrap"}>
              {item.title}
            </Text>
          </Flex>
          <Icon
            asChild
            boxSize={5}
            transform={isOpen ? "rotate(90deg)" : "rotate(0deg)"}
            transition={"transform 0.2s ease-in-out"}
          >
            <CaretRight />
          </Icon>
        </Flex>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Flex flexDir={"column"} gap={2} pt={4} pl={4}>
          {subItems.map((subItem, index) => (
            <Flex
              p={2}
              gap={2}
              key={index}
              _currentPage={
                pathname.split("/")[3] === subItem.to.split("/")[3]
                  ? active
                  : {}
              }
              asChild
              onClick={onClick}
              {...attributes}
            >
              <NavLink to={subItem.to} style={{ textDecoration: "none" }}>
                <Icon asChild boxSize={5}>
                  {subItem.icon}
                </Icon>
                <Text
                  fontSize={{ base: "16px", md: "18px" }}
                  whiteSpace={"nowrap"}
                >
                  {subItem.title}
                </Text>
              </NavLink>
            </Flex>
          ))}
        </Flex>
      </Collapsible.Content>
    </Collapsible.Root>
  ) : (
    <HStack h={"max-content"} gap={3} align={"center"}>
      <Flex
        p={2}
        h={"full"}
        _currentPage={
          pathname.split("/")[1] === item.to.split("/")[1] ? active : {}
        }
        w={"100%"}
        {...attributes}
        whiteSpace={"nowrap"}
        onClick={onClick}
        asChild
      >
        <NavLink to={item.to} style={{ textDecoration: "none" }}>
          <HStack align={"center"} justify={"start"}>
            <Icon boxSize={5} asChild>
              {item.icon}
            </Icon>
            <Text fontSize={{ base: "16px", md: "18px" }} whiteSpace={"nowrap"}>
              {item.title}
            </Text>
          </HStack>
        </NavLink>
      </Flex>
    </HStack>
  );
};

export default SidebarItem;
