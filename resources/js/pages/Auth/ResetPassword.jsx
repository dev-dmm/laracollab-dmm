import ContainerBox from "@/layouts/ContainerBox";
import GuestLayout from "@/layouts/GuestLayout";
import { Button, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "laravel-precognition-react-inertia";
import { useEffect } from "react";
import classes from "./css/ResetPassword.module.css";

const ResetPassword = ({ token }) => {
  const form = useForm("post", route("auth.newPassword.save"), {
    token,
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    return () => {
      form.reset("password", "password_confirmation");
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    form.clearErrors();
    form.submit({ preserveScroll: true });
  };

  return (
    <>
      <Title className={classes.title} ta="center">
        Επαναφορά Κωδικού
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Εισάγετε το email σας και τον νέο σας κωδικό
      </Text>

      <ContainerBox shadow="md" p={30} mt="xl" radius="md">
        <form onSubmit={submit}>
          <TextInput
            label="Email"
            placeholder="Το email σας"
            required
            onChange={(e) => form.setData("email", e.target.value)}
            error={form.errors.email}
          />
          <PasswordInput
            label="Νέος Κωδικός"
            placeholder="Ορίστε νέο κωδικό"
            required
            mt="md"
            value={form.data.password}
            onChange={(e) => form.setData("password", e.target.value)}
            error={form.errors.password}
          />
          <PasswordInput
            label="Επιβεβαίωση Κωδικού"
            placeholder="Επαναλάβετε τον νέο κωδικό"
            required
            mt="md"
            value={form.data.password_confirmation}
            onChange={(e) => form.setData("password_confirmation", e.target.value)}
            error={form.errors.password_confirmation}
          />
          <Button type="submit" fullWidth mt="xl" disabled={form.processing}>
            Επαναφορά Κωδικού
          </Button>
        </form>
      </ContainerBox>
    </>
  );
};

ResetPassword.layout = (page) => <GuestLayout title="Επαναφορά Κωδικού">{page}</GuestLayout>;

export default ResetPassword;
