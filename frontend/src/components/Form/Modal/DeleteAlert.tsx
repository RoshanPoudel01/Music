import { Button } from "@artist/components/ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@artist/components/ui/dialog";
import { Icon, IconButton } from "@chakra-ui/react";
import { Trash } from "@phosphor-icons/react";
import { useState } from "react";

interface IDeleteAlertProps {
  onConfirm: () => Promise<void>;
  heading?: string;
  description?: string;
  deleteText?: string;
  isDeleteLoading?: boolean;
  cancelText?: string;
  trigger?: React.ReactNode;
}

const DeleteAlert: React.FC<IDeleteAlertProps> = ({
  onConfirm,
  heading,
  description,
  deleteText,
  isDeleteLoading,
  cancelText,
  trigger,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DialogRoot
      role="alertdialog"
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      lazyMount
      unmountOnExit
      initialFocusEl={undefined}
      motionPreset={"slide-in-top"}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <IconButton
            size={"sm"}
            variant={"subtle"}
            colorPalette={"red"}
            aria-label="Delete"
          >
            <Icon asChild boxSize={6} borderRadius={5}>
              <Trash />
            </Icon>
          </IconButton>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{heading ?? "Are you sure?"}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            {description ??
              "Are you sure you want to delete this item? This cannot be undone."}
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button colorPalette={"gray"} variant="outline">
              {cancelText ?? "Cancel"}
            </Button>
          </DialogActionTrigger>
          <Button
            colorPalette="red"
            loading={isDeleteLoading}
            onClick={async () => {
              await onConfirm();
              setOpen(false);
            }}
          >
            <Icon asChild boxSize={5}>
              <Trash />
            </Icon>
            {deleteText ?? "Delete"}
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteAlert;
