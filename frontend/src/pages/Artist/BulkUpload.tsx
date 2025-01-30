import { ReactDropzone } from "@artist/components/Form";
import { ModalForm } from "@artist/components/Form/Modal";
import { useUploadArtist } from "@artist/services/service-artist";
import { toFormData } from "@artist/services/service-axios";
import React, { FC, ReactNode } from "react";
import { useForm } from "react-hook-form";

interface IBulkUpload {
  trigger: ReactNode;
  rowId?: number;
}

const BulkUpload: FC<IBulkUpload> = ({ trigger, rowId }) => {
  const [open, setOpen] = React.useState(false);
  const { control, handleSubmit, reset } = useForm();

  const { mutateAsync: addArtist, isPending } = useUploadArtist();

  const onSubmit = async (data: any) => {
    try {
      await addArtist({
        data: toFormData({
          artistList: data.artistList,
        }),
      });

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalForm
      onSubmit={handleSubmit(onSubmit)}
      trigger={trigger}
      open={open}
      onOpenChange={(e) => {
        setOpen(e.open);
      }}
      heading="Bulk Upload Artist"
      isSubmitting={isPending}
      rowId={rowId}
      onClose={() => {
        setOpen(false);
        reset({});
      }}
    >
      <ReactDropzone
        control={control}
        name="artistList"
        label="Artist List"
        options={{
          maxSize: 5000000,
        }}
      />
    </ModalForm>
  );
};

export default BulkUpload;
