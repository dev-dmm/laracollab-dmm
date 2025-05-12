import ContainerBox from "@/layouts/ContainerBox";
import GuestLayout from "@/layouts/GuestLayout";
import { redirectTo } from "@/utils/route";
import {
  Alert,
  Anchor,
  Box,
  Button,
  Center,
  Group,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { IconArrowLeft, IconInfoCircle } from "@tabler/icons-react";
import { useForm } from "laravel-precognition-react-inertia";
import classes from "./css/ForgotPassword.module.css";

const ForgotPassword = ({ status }) => {
  const form = useForm("post", route("auth.forgotPassword.sendLink"), {
    email: "",
  });

  const submit = (e) => {
    e.preventDefault();
    form.clearErrors();
    form.submit({ preserveScroll: true });
  };

  return (
    <>
      <Title className={classes.title} ta="center">
        Ξεχάσατε τον κωδικό σας;
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Εισάγετε το email σας για να λάβετε σύνδεσμο επαναφοράς
      </Text>

      <ContainerBox shadow="md" p={30} mt="xl" radius="md">
        <Text c="dimmed" fz="sm" mb={20}>
          Πληκτρολογήστε το email σας και θα σας στείλουμε έναν σύνδεσμο επαναφοράς κωδικού
          ώστε να ορίσετε έναν νέο.
        </Text>

        {status && (
          <Alert radius="md" title={status} icon={<IconInfoCircle />} mb={10}>
            Ελέγξτε το email σας και ακολουθήστε τις οδηγίες για να ορίσετε νέο κωδικό πρόσβασης.
          </Alert>
        )}

        <form onSubmit={submit}>
          <TextInput
            label="Email"
            placeholder="Το email σας"
            required
            onChange={(e) => form.setData("email", e.target.value)}
            onBlur={() => form.validate("email")}
            error={form.errors.email}
          />
          <Group justify="space-between" mt="lg" className={classes.controls}>
            <Anchor
              c="dimmed"
              size="sm"
              className={classes.control}
              onClick={() => redirectTo("auth.login.form")}
            >
              <Center inline>
                <IconArrowLeft style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                <Box ml={5}>Επιστροφή στη σύνδεση</Box>
              </Center>
            </Anchor>
            <Button type="submit" className={classes.control} disabled={form.processing}>
              Επαναφορά κωδικού
            </Button>
          </Group>
        </form>
      </ContainerBox>
    </>
  );
};

ForgotPassword.layout = (page) => <GuestLayout title="Επαναφορά Κωδικού">{page}</GuestLayout>;

export default ForgotPassword;
