import { ReactDropzone } from "@artist/components/Form";
import { ModalForm } from "@artist/components/Form/Modal";
import { useUploadArtist } from "@artist/services/service-artist";
import { toFormData } from "@artist/services/service-axios";
import { ExportCSV } from "@artist/utils/Export";
import { Button } from "@chakra-ui/react";
import { DownloadSimple } from "@phosphor-icons/react";
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

  const columnHeading = {
    name: "name",
    address: "address",
    dob: "dob",
    first_release_year: "first_release_year",
    no_of_albums_released: "no_of_albums_released",
    gender: "gender",
  };

  const handleExport = async () => {
    ExportCSV({
      fileName: "Artists",
      exportTitle: "Artists",
      csvData: [
        {
          name: "Ram Kumar",
          address: "Kathmandu",
          dob: "1990-01-01",
          first_release_year: 2000,
          no_of_albums_released: 3,
          gender: "male",
        },
      ],
      Heading: [columnHeading],
      header: Object.keys(columnHeading),
    });
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
      <p>
        Note: Please download the sample file and fill the data accordingly.
        Then upload the file.
      </p>
      <Button w={"max-content"} onClick={handleExport}>
        <DownloadSimple size={32} /> Download Sample
      </Button>
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
