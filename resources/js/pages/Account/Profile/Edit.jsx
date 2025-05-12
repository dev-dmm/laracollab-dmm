import ActionButton from "@/components/ActionButton";
import useForm from "@/hooks/useForm";
import ContainerBox from "@/layouts/ContainerBox";
import Layout from "@/layouts/MainLayout";
import { getInitials } from "@/utils/user";
import { usePage } from "@inertiajs/react";
import {
  Anchor,
  Avatar,
  Divider,
  FileInput,
  Grid,
  Group,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

const ProfileIndex = () => {
  const { user } = usePage().props;

  const [form, submit, updateValue] = useForm("post", route("account.profile.update", user.id), {
    _method: "put",
    avatar: null,
    job_title: user.job_title,
    name: user.name,
    phone: user.phone || "",
    email: user.email,
    password: "",
    password_confirmation: "",
  });

  return (
    <>
      <Grid justify="space-between" align="flex-end" gutter="xl" mb="lg">
        <Grid.Col span="auto">
          <Title order={1}>Το Προφίλ μου</Title>
        </Grid.Col>
        <Grid.Col span="content"></Grid.Col>
      </Grid>

      <ContainerBox maw={600}>
        <form onSubmit={(e) => submit(e, { forceFormData: true })}>
          <Grid justify="flex-start" align="flex-start" gutter="lg">
            <Grid.Col span="content">
              <Avatar
                src={
                  form.data.avatar === null ? user.avatar : URL.createObjectURL(form.data.avatar)
                }
                size={120}
                color="blue"
              >
                {getInitials(form.data.name)}
              </Avatar>
            </Grid.Col>
            <Grid.Col span="auto">
              <FileInput
                label="Εικόνα προφίλ"
                placeholder="Επιλέξτε εικόνα"
                accept="image/png,image/jpeg"
                onChange={(image) => updateValue("avatar", image)}
                clearable
                error={form.errors.avatar}
              />
              <Text size="xs" c="dimmed" mt="sm">
                Αν δεν επιλέξετε εικόνα, θα προσπαθήσουμε να την ανακτήσουμε από{" "}
                <Anchor href="https://unavatar.io" target="_blank" opacity={0.6}>
                  unavatar.io
                </Anchor>
              </Text>
            </Grid.Col>
          </Grid>

          <TextInput
            label="Όνομα"
            placeholder="Πλήρες όνομα χρήστη"
            required
            mt="md"
            value={form.data.name}
            onChange={(e) => updateValue("name", e.target.value)}
            error={form.errors.name}
          />

          <TextInput
            label="Τίτλος Εργασίας"
            placeholder="π.χ. Frontend Developer"
            required
            mt="md"
            value={form.data.job_title}
            onChange={(e) => updateValue("job_title", e.target.value)}
            error={form.errors.job_title}
          />

          <TextInput
            label="Τηλέφωνο"
            placeholder="Αριθμός τηλεφώνου"
            mt="md"
            value={form.data.phone}
            onChange={(e) => updateValue("phone", e.target.value)}
            error={form.errors.phone}
          />

          <Divider mt="xl" mb="md" label="Στοιχεία Σύνδεσης" labelPosition="center" />

          <TextInput
            label="Email"
            placeholder="Το email σας"
            required
            value={form.data.email}
            onChange={(e) => updateValue("email", e.target.value)}
            onBlur={() => form.validate("email")}
            error={form.errors.email}
          />

          <PasswordInput
            label="Κωδικός"
            placeholder="Νέος κωδικός"
            mt="md"
            value={form.data.password}
            onChange={(e) => updateValue("password", e.target.value)}
            error={form.errors.password}
          />

          <PasswordInput
            label="Επιβεβαίωση Κωδικού"
            placeholder="Επαναλάβετε τον νέο κωδικό"
            mt="md"
            value={form.data.password_confirmation}
            onChange={(e) => updateValue("password_confirmation", e.target.value)}
            error={form.errors.password_confirmation}
          />

          <Group justify="flex-end" mt="xl">
            <ActionButton loading={form.processing}>Αποθήκευση</ActionButton>
          </Group>
        </form>
      </ContainerBox>
    </>
  );
};

ProfileIndex.layout = (page) => <Layout title="Προφίλ">{page}</Layout>;

export default ProfileIndex;
