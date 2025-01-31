// SingleFilePreview.tsx

import { imageAssets } from "@artist/assets/images";
import LazyLoadImage from "@artist/components/Image";
import { ConditionalValue, Flex, Icon, IconButton } from "@chakra-ui/react";
import { Trash } from "@phosphor-icons/react";
import React from "react";

interface SingleFilePreviewProps {
  url: string;
  fileName: string;
  onDelete: () => void;
  aspectRatio?: ConditionalValue<string | number>;
  isFile?: boolean;
}

const SingleFilePreview: React.FC<SingleFilePreviewProps> = ({
  url,
  onDelete,
  aspectRatio,
  isFile,
}) => {
  return (
    <Flex gap={2} flexDir="column" position="relative" overflow={"hidden"}>
      {isFile ? (
        <LazyLoadImage
          w={"full"}
          height={"150px"}
          objectFit="cover"
          objectPosition={"center"}
          border={"1px solid"}
          borderColor={"gray.500"}
          borderRadius={"5px"}
          overflow={"hidden"}
          src={imageAssets.File}
          aspectRatio={aspectRatio ?? 5}
        />
      ) : (
        <LazyLoadImage
          w={"full"}
          objectFit="cover"
          objectPosition={"center"}
          border={"1px solid"}
          borderColor={"gray.500"}
          borderRadius={"5px"}
          overflow={"hidden"}
          src={url}
          aspectRatio={aspectRatio ?? 1}
        />
      )}

      <IconButton
        alignSelf={"center"}
        aria-label="Delete Image"
        borderRadius={2}
        colorPalette="red"
        size="xs"
        variant={"subtle"}
        position="absolute"
        top={0}
        right={0}
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
      >
        <Icon boxSize={6} asChild>
          <Trash />
        </Icon>
      </IconButton>
    </Flex>
  );
};

export default SingleFilePreview;
