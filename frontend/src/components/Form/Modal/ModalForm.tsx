import { Button } from "@artist/components/ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@artist/components/ui/dialog";
import {
  DialogContentProps,
  DialogOpenChangeDetails,
  Flex,
  Icon,
  IconButton,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { Pencil } from "@phosphor-icons/react";
import React, { FC } from "react";
import { SubmitHandler } from "react-hook-form";
interface IModalFormProps {
  onSubmit: SubmitHandler<any>;
  heading?: string;
  submitText?: string;
  isSubmitting?: boolean;
  cancelText?: string;
  trigger?: React.ReactNode;
  open: boolean;
  onOpenChange: ((details: DialogOpenChangeDetails) => void) | undefined;
  onClose?: () => void;
  rowId?: number | string | null;
  children: React.ReactNode;
  formId?: string;
  isFetching?: boolean;
  closeOnInteractOutside?: boolean;
}
const ModalForm: FC<IModalFormProps & DialogContentProps> = ({
  onSubmit,
  rowId,
  heading,
  children,
  submitText,
  isSubmitting,
  isFetching,
  cancelText,
  trigger,
  open,
  onOpenChange,
  onClose,
  closeOnInteractOutside = false,
  formId = "modal-form",
  ...rest
}) => {
  return (
    <DialogRoot
      open={open}
      onOpenChange={onOpenChange}
      // scrollBehavior={"inside"}
      lazyMount
      unmountOnExit
      motionPreset={"slide-in-top"}
      preventScroll
      placement={"center"}
      size={"xl"}
      closeOnInteractOutside={closeOnInteractOutside}
      initialFocusEl={undefined}
      onExitComplete={onClose}
    >
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : !trigger && rowId ? (
          <IconButton
            size={"sm"}
            variant={"subtle"}
            colorPalette={"blue"}
            aria-label="Edit"
          >
            <Icon asChild boxSize={6} borderRadius={5}>
              <Pencil />
            </Icon>
          </IconButton>
        ) : (
          <Button aria-label="Add">Add</Button>
        )}
      </DialogTrigger>
      <DialogContent {...rest} mx={2}>
        <DialogHeader
          py={4}
          borderTopRadius={5}
          bg={"gray.100"}
          color={"gray.800"}
        >
          <DialogTitle>
            {heading ? heading : rowId ? "Edit" : "Add"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody py={4} asChild>
          {isFetching && !!rowId ? (
            <Flex justify={"center"} align={"center"} minH={"30vh"}>
              <Spinner
                boxSize={"50px"}
                borderWidth="4px"
                animationDuration="0.85s"
              />
            </Flex>
          ) : (
            <Stack asChild gap={4}>
              <form id={formId} onSubmit={onSubmit} noValidate>
                {children}
              </form>
            </Stack>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button size={"sm"} variant="outline">
              {cancelText ?? "Close"}
            </Button>
          </DialogActionTrigger>
          <Button
            size={"sm"}
            loading={isSubmitting}
            type="submit"
            form={formId}
          >
            {submitText ?? "Submit"}
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default ModalForm;
