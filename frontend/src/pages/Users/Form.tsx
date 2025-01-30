import { StatusRadio, TextInput } from "@artist/components/Form";
import { ModalForm } from "@artist/components/Form/Modal";
import { useFetchUser, useRegisterUser } from "@artist/services/service-user";
import { Stack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import React, { FC, ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
const defaultValues = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  phone: "",
  address: "",
  dob: "",
  gender: "",
};

type FormValues = yup.InferType<typeof schema>;

interface IUserForm {
  trigger: ReactNode;
  rowId?: number;
}

const UserForm: FC<IUserForm> = ({ trigger, rowId }) => {
  const [open, setOpen] = React.useState(false);
  const schema = yup.object().shape({
    first_name: yup.string().required("First Name is required"),
    last_name: yup.string().required("Last Name is required"),
    email: yup.string().email().required("Email is required"),
    phone: yup.string().required("Phone is required"),
    address: yup.string().required("Address is required"),
    password: yup
      .string()
      .test("password-required", "Password is required", function () {
        if (!rowId) {
          return !!this.parent.password;
        }
        return true;
      })
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
      is: (password) => !!password,
      then: (schema) =>
        schema.oneOf([yup.ref("password")], "Passwords must match"),
      otherwise: (schema) => schema,
    }),
    dob: yup.string().required("Date of Birth is required"),
    gender: yup.string().required("Select Gender"),
  });
  const { mutateAsync: addUser, isPending } = useRegisterUser();
  const { data: user, isLoading } = useFetchUser(rowId!, open);

  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    if (user) {
      reset({
        first_name: user?.data?.first_name,
        last_name: user?.data?.last_name,
        email: user?.data?.email,
        phone: user?.data?.phone,
        address: user?.data?.address,
        dob: moment(user?.data?.dob).format("YYYY-MM-DD"),
        gender: user?.data?.gender,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (rowId) {
        await addUser({
          data: {
            ...data,
            id: rowId,
          },
        });
      } else {
        await addUser({ data: data });
      }
      reset(defaultValues);
      setOpen(false);
    } catch (e) {
      console.error(e);
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
      title="Add User"
      isSubmitting={isPending}
      rowId={rowId}
      isFetching={isLoading}
    >
      <Stack>
        <TextInput
          control={control}
          required
          name="first_name"
          label="First Name"
        />
        <TextInput
          control={control}
          required
          name="last_name"
          label="Last Name"
        />
        <TextInput
          control={control}
          required
          name="email"
          type="email"
          label="Email"
        />
        <TextInput control={control} required name="phone" label="Phone" />

        <TextInput control={control} required name="address" label="Address" />
        {!rowId && (
          <>
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
          </>
        )}
        <TextInput
          control={control}
          required
          name="dob"
          label="Date of Birth"
          type="date"
        />
        <StatusRadio
          control={control}
          name="gender"
          label="Gender"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
          ]}
          required
        />
      </Stack>
    </ModalForm>
  );
};

export default UserForm;
