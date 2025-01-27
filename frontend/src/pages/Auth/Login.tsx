import { TextInput } from "@artist/components/Form";
import { Button } from "@artist/components/ui/button";
import { useLogin } from "@artist/services/service-auth";
import { Card, Center, Link as CLink, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Lock, User } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { NAVIGATION_ROUTES } from "../App/navigationRoutes";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormValues = yup.InferType<typeof schema>;

const Login = () => {
  const defaultValues = {
    email: "",
    password: "",
  };
  const { mutateAsync: login, isPending } = useLogin();
  const { control, handleSubmit } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Center h={"100dvh"} maxW={"100dvw"} px={4} overflowX={"hidden"}>
      <Card.Root maxW={"600px"} w={"full"} p={4} asChild>
        <form id="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card.Header textAlign={"center"} gap={4}>
            <Card.Title fontSize={"30px"}>Login</Card.Title>
            <Card.Description fontSize={"20px"}>
              Please enter your credentials to login.
            </Card.Description>
          </Card.Header>
          <Card.Body gap={6}>
            <TextInput
              startElement={<User />}
              control={control}
              required
              name="email"
              type="email"
              label="Email"
            />
            <TextInput
              startElement={<Lock />}
              control={control}
              required
              name="password"
              type="password"
              label="Password"
            />
          </Card.Body>
          <Card.Footer display={"flex"} flexDir={"column"} gap={4}>
            <Button
              type="submit"
              form="login-form"
              w={"full"}
              color={"white"}
              loading={isPending}
            >
              Login
            </Button>
            <Text alignSelf={"center"} fontSize={"sm"}>
              Are you new here? &nbsp;
              <CLink variant={"underline"} alignSelf={"center"} asChild>
                <Link to={NAVIGATION_ROUTES.REGISTER}> Register here.</Link>
              </CLink>
            </Text>
          </Card.Footer>
        </form>
      </Card.Root>
    </Center>
  );
};

export default Login;
