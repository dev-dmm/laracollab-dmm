import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/BackButton";
import useForm from "@/hooks/useForm";
import ContainerBox from "@/layouts/ContainerBox";
import Layout from "@/layouts/MainLayout";
import { redirectTo } from "@/utils/route";
import { Anchor, Breadcrumbs, ColorInput, Grid, Group, TextInput, Title } from "@mantine/core";

const StatusCreate = () => {
  const [form, submit, updateValue] = useForm("post", route("settings.statuses.store"), {
    name: "", // ✅ changed from "label"
    color: "",
  });

  return (
    <>
      <Breadcrumbs fz={14} mb={30}>
        <Anchor href="#" onClick={() => redirectTo("settings.statuses.index")} fz={14}>
          Καταστάσεις
        </Anchor>
        <div>Δημιουργία</div>
      </Breadcrumbs>

      <Grid justify="space-between" align="flex-end" gutter="xl" mb="lg">
        <Grid.Col span="auto">
          <Title order={1}>Δημιουργία Κατάστασης</Title>
        </Grid.Col>
      </Grid>

      <ContainerBox maw={400}>
        <form onSubmit={submit}>
          <TextInput
            label="Όνομα"
            placeholder="Όνομα κατάστασης"
            required
            value={form.data.name} // ✅ changed
            onChange={(e) => updateValue("name", e.target.value)} // ✅ changed
            error={form.errors.name}
          />
          <ColorInput
            label="Χρώμα"
            placeholder="Χρώμα κατάστασης"
            required
            mt="md"
            swatches={[
              "#343A40", "#E03231", "#C2255C", "#9C36B5", "#6741D9", "#3B5BDB",
              "#2771C2", "#2A8599", "#2B9267", "#309E44", "#66A810", "#F08C00", "#E7590D",
            ]}
            swatchesPerRow={7}
            value={form.data.color}
            onChange={(color) => updateValue("color", color)}
            error={form.errors.color}
          />

          <Group justify="space-between" mt="xl">
            <BackButton route="settings.statuses.index" />
            <ActionButton loading={form.processing}>Δημιουργία</ActionButton>
          </Group>
        </form>
      </ContainerBox>
    </>
  );
};

StatusCreate.layout = (page) => <Layout title="Δημιουργία Κατάστασης">{page}</Layout>;

export default StatusCreate;
