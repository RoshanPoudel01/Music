import { TextInput } from "@artist/components/Form";
import { ModalForm } from "@artist/components/Form/Modal";
import SelectInput from "@artist/components/SelectInput";
import { useAddMusic, useFetchMusic } from "@artist/services/service-music";
import { ISelectOptions } from "@artist/utils/format";
import { Stack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import * as yup from "yup";
interface IMusicFormProps {
  trigger: ReactNode;
  rowId?: number;
}

const MusicForm: FC<IMusicFormProps> = ({ trigger, rowId }) => {
  const defaultValues: {
    title: string;
    album_name: string;
    genre: ISelectOptions<string> | null;
  } = {
    title: "",
    album_name: "",
    genre: null,
  };

  const { id } = useParams<{ id: string }>();

  if (!id) {
    throw new Error("id not found");
  }

  const genres = [
    { label: "Mozart", value: "mb" },
    { label: "Johnny Cash", value: "country" },
    { label: "Beethoven", value: "classic" },
    { label: "The Beatles", value: "rock" },
    { label: "Miles Davis", value: "jazz" },
  ];

  const [open, setOpen] = useState(false);
  const { data: music, isLoading } = useFetchMusic(rowId!, open);

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    album_name: yup.string().required("Album Name is required"),
    genre: yup.object().nullable().required("Genre is required"),
  });
  const { handleSubmit, reset, control } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (music) {
      reset({
        title: music?.data?.title,
        album_name: music?.data?.album_name,
        genre: genres.find((genre) => genre.value === music?.data.genre),
      });
    }
  }, [music, reset]);

  const { mutateAsync, isPending } = useAddMusic();
  const ref = useRef<HTMLDivElement>(null);
  const onSubmit = async (data: typeof defaultValues) => {
    const preparedData = {
      artist_id: +id,
      title: data.title,
      album_name: data.album_name,
      genre: data?.genre?.value,
    };
    try {
      if (rowId) {
        await mutateAsync({
          data: {
            ...preparedData,
            id: rowId,
          },
        });
      } else {
        await mutateAsync({
          data: preparedData,
        });
      }
      setOpen(false);
      reset(defaultValues);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalForm
      heading="Add Music"
      trigger={trigger}
      open={open}
      onOpenChange={(e) => {
        setOpen(e.open);
        if (!rowId) {
          reset(defaultValues);
        }
      }}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isPending}
      isFetching={isLoading}
      onClose={() => {
        setOpen(false);
        reset(defaultValues);
      }}
    >
      <Stack ref={ref}>
        <TextInput name="title" label="Title" control={control} />
        <TextInput name="album_name" label="Album Name" control={control} />
        <SelectInput
          name="genre"
          label="Genre"
          control={control}
          options={genres.map((genre) => ({
            label: genre.label,
            value: genre.value,
          }))}
        />
      </Stack>
    </ModalForm>
  );
};

export default MusicForm;
