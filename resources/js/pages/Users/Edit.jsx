import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/BackButton";
import useForm from "@/hooks/useForm";
import useRoles from "@/hooks/useRoles";
import ContainerBox from "@/layouts/ContainerBox";
import Layout from "@/layouts/MainLayout";
import { redirectTo } from "@/utils/route";
import { getInitials } from "@/utils/user";
import { usePage } from "@inertiajs/react";
import {
  Anchor,
  Avatar,
  Breadcrumbs,
  Divider,
  FileInput,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

const UserEdit = () => {
  const { item } = usePage().props;
  const { getDropdownValues } = useRoles();

  const [form, submit, updateValue] = useForm("post", route("users.update", item.id), {
    _method: "put",
    avatar: null,
    job_title: item.job_title,
    name: item.name,
    phone: item.phone || "",
    rate: item.rate / 100,
    email: item.email,
    password: "",
    password_confirmation: "",
    roles: item.roles,
  });

  return (
    <>
      <Breadcrumbs fz={14} mb={30}>
        <Anchor href="#" onClick={() => redirectTo("users.index")} fz={14}>
          Χρήστες
        </Anchor>
        <div>Επεξεργασία</div>
      </Breadcrumbs>

      <Grid justify="space-between" align="flex-end" gutter="xl" mb="lg">
        <Grid.Col span="auto">
          <Title order={1}>Επεξεργασία Χρήστη</Title>
        </Grid.Col>
        <Grid.Col span="content"></Grid.Col>
      </Grid>

      <ContainerBox maw={600}>
        <form onSubmit={(e) => submit(e, { forceFormData: true })}>
          <Grid justify="flex-start" align="flex-start" gutter="lg">
            <Grid.Col span="content">
              <Avatar
                src={
                  form.data.avatar === null ? item.avatar : URL.createObjectURL(form.data.avatar)
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
                placeholder="Επιλογή εικόνας"
                accept="image/png,image/jpeg"
                onChange={(image) => updateValue("avatar", image)}
                clearable
                error={form.errors.avatar}
              />
              <Text size="xs" c="dimmed" mt="sm">
                Αν δεν ανεβάσετε εικόνα, θα προσπαθήσουμε να τη βρούμε μέσω της υπηρεσίας{" "}
                <Anchor href="https://unavatar.io" target="_blank" opacity={0.6}>
                  unavatar.io
                </Anchor>
              </Text>
            </Grid.Col>
          </Grid>

          <TextInput
            label="Όνομα"
            placeholder="Ονοματεπώνυμο χρήστη"
            required
            mt="md"
            value={form.data.name}
            onChange={(e) => updateValue("name", e.target.value)}
            error={form.errors.name}
          />

          <TextInput
            label="Τίτλος θέσης"
            placeholder="π.χ. Frontend Developer"
            required
            mt="md"
            value={form.data.job_title}
            onChange={(e) => updateValue("job_title", e.target.value)}
            error={form.errors.job_title}
          />

          <MultiSelect
            label="Ρόλοι"
            placeholder="Επιλέξτε ρόλο"
            required
            mt="md"
            value={form.data.roles}
            onChange={(values) => updateValue("roles", values)}
            data={getDropdownValues({ except: ["client"] })}
            error={form.errors.roles}
          />

          <Group grow mt="md">
            <TextInput
              label="Τηλέφωνο"
              placeholder="Τηλέφωνο χρήστη"
              value={form.data.phone}
              onChange={(e) => updateValue("phone", e.target.value)}
              error={form.errors.phone}
            />

            <NumberInput
              label="Ωρομίσθιο"
              allowNegative={false}
              clampBehavior="strict"
              decimalScale={2}
              fixedDecimalScale={true}
              prefix="€"
              value={form.data.rate}
              onChange={(value) => updateValue("rate", value)}
              error={form.errors.rate}
            />
          </Group>

          <Divider mt="xl" mb="md" label="Στοιχεία σύνδεσης" labelPosition="center" />

          <TextInput
            label="Email"
            placeholder="Email χρήστη"
            required
            value={form.data.email}
            onChange={(e) => updateValue("email", e.target.value)}
            onBlur={() => form.validate("email")}
            error={form.errors.email}
          />

          <PasswordInput
            label="Κωδικός"
            placeholder="Κωδικός χρήστη"
            mt="md"
            value={form.data.password}
            onChange={(e) => updateValue("password", e.target.value)}
            error={form.errors.password}
          />

          <PasswordInput
            label="Επιβεβαίωση κωδικού"
            placeholder="Επιβεβαίωση κωδικού"
            mt="md"
            value={form.data.password_confirmation}
            onChange={(e) => updateValue("password_confirmation", e.target.value)}
            error={form.errors.password_confirmation}
          />

          <Group justify="space-between" mt="xl">
            <BackButton route="users.index" />
            <ActionButton loading={form.processing}>Αποθήκευση</ActionButton>
          </Group>
        </form>
      </ContainerBox>
    </>
  );
};

UserEdit.layout = (page) => <Layout title="Επεξεργασία Χρήστη">{page}</Layout>;

export default UserEdit;
