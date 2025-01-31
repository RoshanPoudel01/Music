import { TextInput } from "@artist/components/Form";
import { ModalForm } from "@artist/components/Form/Modal";
import { useChangePassword } from "@artist/services/service-user";
import { useInitDataStore } from "@artist/store";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { FC, ReactNode } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
interface IChangePassword {
  trigger: ReactNode;
  rowId?: number;
}
const schema = yup.object().shape({
  old_password: yup.string().required("Old Password is required"),
  password: yup
    .string()
    .required("Password is required")
    .test(
      "password-length",
      "Password must be at least 6 characters",
      function (value) {
        // Only check length if password is provided
        if (value) {
          return value.length >= 6;
        }
        return true;
      }
    ),
  confirm_password: yup.string().when("password", {
    is: (password: string) => !!password,
    then: (schema) =>
      schema.oneOf([yup.ref("password")], "Passwords must match"),
    otherwise: (schema) => schema,
  }),
});

type PasswordFormValues = yup.InferType<typeof schema>;

const defaultValues = {
  old_password: "",
  password: "",
  confirm_password: "",
};
const ChangePassword: FC<IChangePassword> = ({ trigger, rowId }) => {
  const { initData } = useInitDataStore();
  const [open, setOpen] = React.useState(false);
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { mutateAsync: addArtist, isPending } = useChangePassword();

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      await addArtist({
        data: {
          oldPassword: data.old_password,
          newPassword: data.password,
          id: initData?.id,
        },
      });

      setOpen(false);
      reset(defaultValues);
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
      onClose={() => {
        setOpen(false);
        reset(defaultValues);
      }}
      heading="Change Password"
      isSubmitting={isPending}
      rowId={rowId}
    >
      <TextInput
        control={control}
        required
        name="old_password"
        type="password"
        label="Old Password"
      />
      <TextInput
        control={control}
        required
        name="password"
        type="password"
        label="Password"
      />
      <TextInput
        control={control}
        required
        name="confirm_password"
        type="password"
        label="Confirm Password"
      />
    </ModalForm>
  );
};

export default ChangePassword;
