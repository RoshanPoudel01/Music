import { TextInput } from "@artist/components/Form";
import { ModalForm } from "@artist/components/Form/Modal";
import RadioCard from "@artist/components/RadioCard";
import { useAddArtist, useFetchArtist } from "@artist/services/service-artist";
import { Stack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import React, { FC, ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  dob: yup.string().required("Date of Birth is required"),
  gender: yup.string().required("Select a gender"),
  address: yup.string().required("Address is required"),
  first_release_year: yup.number().required("First Release Year is required"),
  no_of_albums_released: yup
    .number()
    .required("Number of Albums Released is required"),
});

type ArtistFormValues = yup.InferType<typeof schema>;

interface IArtistForm {
  trigger: ReactNode;
  rowId?: number;
}

const ArtistForm: FC<IArtistForm> = ({ trigger, rowId }) => {
  const defaultValues = {
    name: "",
    dob: "",
    gender: "",
    address: "",
    first_release_year: "" as never as number,
    no_of_albums_released: "" as never as number,
  };

  const [open, setOpen] = React.useState(false);
  const { data: artist, isLoading } = useFetchArtist(rowId!, open);
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    if (artist) {
      reset({
        name: artist?.data.name,
        address: artist?.data.address,
        gender: artist?.data?.gender,
        dob: moment(artist?.data.dob).format("YYYY-MM-DD"),
        first_release_year: artist?.data.first_release_year,
        no_of_albums_released: artist?.data.no_of_albums_released,
      });
    }
  }, [artist, reset]);

  const { mutateAsync: addArtist, isPending } = useAddArtist();

  const onSubmit = async (data: ArtistFormValues) => {
    try {
      if (rowId) {
        await addArtist({
          id: rowId,
          data: {
            ...data,
            id: rowId,
          },
        });
      } else {
        await addArtist({ data });
      }
      reset(defaultValues);
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
      title="Add Artist"
      isSubmitting={isPending}
      rowId={rowId}
      isFetching={isLoading}
    >
      <Stack>
        <TextInput control={control} name="name" label="Name" />
        <TextInput
          control={control}
          name="dob"
          label="Date of Birth"
          type="date"
        />
        <RadioCard
          control={control}
          name="gender"
          label="Gender"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
          ]}
        />
        <TextInput control={control} name="address" label="Address" />
        <TextInput
          control={control}
          name="first_release_year"
          label="First Release Year"
          type="number"
        />
        <TextInput
          control={control}
          name="no_of_albums_released"
          label="Number of Albums Released"
          type="number"
        />
      </Stack>
    </ModalForm>
  );
};

export default ArtistForm;
