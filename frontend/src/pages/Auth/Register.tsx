import { StatusRadio, TextInput } from "@artist/components/Form";
import { Button } from "@artist/components/ui/button";
import { useRegisterUser } from "@artist/services/service-user";
import {
  Card,
  Center,
  Link as CLink,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { NAVIGATION_ROUTES } from "../App/navigationRoutes";

const schema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
  dob: yup.string().required("Date of Birth is required"),
  gender: yup.string().required("Select Gender"),
});

type RegisterFormValues = yup.InferType<typeof schema>;

const Register = () => {
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
  const navigate = useNavigate();
  const { mutateAsync: register, isPending } = useRegisterUser();
  const { control, handleSubmit } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const { confirm_password, ...rest } = data;
    try {
      const response = await register({ data: rest });
      if (response.data.status) {
        navigate("/");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Center h={"100dvh"} maxW={"100dvw"} px={4} overflowX={"hidden"}>
      <Card.Root maxW={"600px"} w={"full"} p={4} asChild>
        <form id="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card.Header textAlign={"center"} gap={4}>
            <Card.Title fontSize={"30px"}>Register</Card.Title>
            <Card.Description fontSize={"20px"}>
              Please enter your credentials to register.
            </Card.Description>
          </Card.Header>
          <Card.Body gap={6}>
            <SimpleGrid
              alignItems={"start"}
              columns={{ base: 1, md: 2 }}
              gap={4}
            >
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
              <TextInput
                control={control}
                required
                name="phone"
                label="Phone"
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

              <TextInput
                control={control}
                required
                name="address"
                label="Address"
              />
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
            </SimpleGrid>
          </Card.Body>
          <Card.Footer display={"flex"} flexDir={"column"} gap={4}>
            <Button
              type="submit"
              form="register-form"
              w={"full"}
              color={"white"}
              loading={isPending}
            >
              Register
            </Button>
            <Text alignSelf={"center"} fontSize={"sm"}>
              Already have an account? &nbsp;
              <CLink variant={"underline"} alignSelf={"center"} asChild>
                <Link to={NAVIGATION_ROUTES.LOGIN}> Login.</Link>
              </CLink>
            </Text>
          </Card.Footer>
        </form>
      </Card.Root>
    </Center>
  );
};

export default Register;
