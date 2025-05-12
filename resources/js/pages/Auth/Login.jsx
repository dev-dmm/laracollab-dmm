import GoogleIcon from "@/icons/GoogleIcon";
import ContainerBox from "@/layouts/ContainerBox";
import GuestLayout from "@/layouts/GuestLayout";
import { router } from "@inertiajs/react";
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "laravel-precognition-react-inertia";
import { useEffect, useRef, useState } from "react";
import LoginNotification from "./LoginNotification";
import classes from "./css/Login.module.css";

const Login = ({ notify }) => {
  const [socialLoginPending, setSocialLoginPending] = useState(false);
  const passwordRef = useRef(null);

  const form = useForm("post", route("auth.login.attempt"), {
    email: route().params?.email || "",
    password: "",
    remember: false,
  });

  useEffect(() => route().params?.email && passwordRef.current.focus(), []);

  const submit = (e) => {
    e.preventDefault();
    form.submit({ preserveScroll: true });
  };

  return (
    <>
      <Title ta="center" className={classes.title}>
        Καλωσόρισες ξανά!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Συνδέσου στον λογαριασμό σου παρακάτω
      </Text>

      <LoginNotification notify={notify} />

      <form onSubmit={submit}>
        <ContainerBox shadow="md" p={30} mt={30} radius="md">
          <Group grow mb="md" mt="md">
            <Button
              leftSection={<GoogleIcon />}
              variant="default"
              radius="xl"
              component="a"
              href={route("auth.login.social.google")}
              loading={socialLoginPending}
              onClick={() => setSocialLoginPending(true)}
            >
              Google
            </Button>
          </Group>

          <Divider label="Ή συνέχισε με email" labelPosition="center" my="lg" />

          <TextInput
            label="Email"
            placeholder="Το email σου"
            required
            value={form.data.email}
            onChange={(e) => form.setData("email", e.target.value)}
            onBlur={() => form.validate("email")}
            error={form.errors.email}
          />
          <PasswordInput
            ref={passwordRef}
            label="Κωδικός"
            placeholder="Ο κωδικός σου"
            required
            mt="md"
            value={form.data.password}
            onChange={(e) => form.setData("password", e.target.value)}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox
              label="Να με θυμάσαι"
              checked={form.data.remember}
              onChange={(e) => form.setData("remember", e.currentTarget.checked)}
            />
            <Anchor
              type="button"
              size="sm"
              onClick={() => router.get(route("auth.forgotPassword.form"))}
            >
              Ξέχασες τον κωδικό;
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl" disabled={form.processing}>
            Σύνδεση
          </Button>
        </ContainerBox>
      </form>
    </>
  );
};

Login.layout = (page) => <GuestLayout title="Σύνδεση">{page}</GuestLayout>;

export default Login;
