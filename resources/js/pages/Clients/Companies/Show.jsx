import { Card, Group, Text, Title, Badge, Tabs, Anchor, Divider, Box } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { usePage } from "@inertiajs/react";
import Layout from "@/layouts/MainLayout";

const CompanyShow = () => {
  const { item, activities = [] } = usePage().props;

  return (
    <Box>
      <Anchor href={route("clients.companies.index")}> 
        <Group mb="md">
          <IconArrowLeft size={16} />
          <Text>Back to clients</Text>
        </Group>
      </Anchor>

      <Group align="flex-start" grow>
        {/* LEFT SIDE: INFO CARD */}
        <Card withBorder p="lg" radius="md" w={340}>
          <Group justify="space-between" mb="xs">
            <Title order={3}>{item.name}</Title>
            <Badge color="green" variant="light">Active</Badge>
          </Group>

          <Text size="xs" c="dimmed" mb="sm">{item.email}</Text>

          <Divider my="sm" />

          <Text size="sm" fw={500} mb={4}>Contact Information</Text>
          {item.clients.map((client) => (
            <Box key={client.id} mb="sm">
              <Text size="sm">{client.name}</Text>
              <Text size="xs" c="dimmed">{client.email}</Text>
              <Text size="xs" c="dimmed">{client.phone || '—'}</Text>
            </Box>
          ))}

          <Divider my="sm" />

          <Text size="sm" fw={500} mb={4}>Address</Text>
          <Text size="xs">{item.address || '—'}</Text>
          <Text size="xs">{item.city || '—'} {item.postal_code || ''}</Text>
          <Text size="xs">{item.country?.name || '—'}</Text>

          <Divider my="sm" />

          <Text size="sm" fw={500} mb={4}>Company Details</Text>
          <Text size="xs">Business ID: {item.business_id || '—'}</Text>
          <Text size="xs">VAT: {item.vat || '—'}</Text>
        </Card>

        {/* RIGHT SIDE: TABS */}
        <Box style={{ flex: 1 }}>
          <Tabs defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="projects">Projects</Tabs.Tab>
              <Tabs.Tab value="communication">Activities</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="overview" pt="md">
              <Group grow>
                <Card withBorder p="md" radius="md">
                  <Text size="xs" c="dimmed">Projects</Text>
                  <Title order={3}>{item.projects.length}</Title>
                </Card>
                <Card withBorder p="md" radius="md">
                  <Text size="xs" c="dimmed">Active</Text>
                  <Title order={3}>{item.projects.filter(p => !p.archived_at).length}</Title>
                </Card>
                <Card withBorder p="md" radius="md">
                  <Text size="xs" c="dimmed">Archived</Text>
                  <Title order={3}>{item.projects.filter(p => p.archived_at).length}</Title>
                </Card>
                <Card withBorder p="md" radius="md">
                  <Text size="xs" c="dimmed">Activities</Text>
                  <Title order={3}>{activities.length}</Title>
                </Card>
              </Group>

              <Title order={4} mt="lg" mb="sm">Recent Projects</Title>
              {item.projects.length ? (
                item.projects.map((project) => (
                  <Anchor
                    key={project.id}
                    href={route('projects.tasks', project.id)}
                    style={{ textDecoration: 'none' }}
                  >
                  <Card key={project.id} withBorder mb="sm">
                    <Text fw={500}>{project.name}</Text>
                    <Text fz="xs" c="dimmed">
                      Created at: {new Date(project.created_at).toLocaleDateString()}
                    </Text>
                  </Card>
                 </Anchor>
                ))
              ) : (
                <Text c="dimmed" fz="sm">No projects found for this company.</Text>
              )}

              <Title order={4} mt="lg" mb="sm">Recent Activities</Title>
              {activities.length ? (
                activities.map((activity, i) => (
                  <Card key={i} withBorder mb="sm">
                    <Text>{activity.title}</Text>
                    <Text size="xs" c="dimmed">{new Date(activity.created_at).toLocaleDateString()}</Text>
                  </Card>
                ))
              ) : (
                <Text c="dimmed" fz="sm">No activity found.</Text>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="projects" pt="md">
              {item.projects.length ? (
                item.projects.map((project) => (
                  <Anchor
                    key={project.id}
                    href={route('projects.tasks', project.id)}
                    style={{ textDecoration: 'none' }}
                  >
                    <Card withBorder mb="sm" style={{ cursor: 'pointer' }}>
                      <Text fw={500}>{project.name}</Text>
                      <Text fz="xs" c="dimmed">
                        Created at: {new Date(project.created_at).toLocaleDateString()}
                      </Text>
                    </Card>
                  </Anchor>
                ))
              ) : (
                <Text c="dimmed" fz="sm">No projects found for this company.</Text>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="communication" pt="md">
              {activities.length ? (
                activities.map((activity, i) => (
                  <Card key={i} withBorder mb="sm">
                    <Text>{activity.title}</Text>
                    <Text size="xs" c="dimmed">{new Date(activity.created_at).toLocaleDateString()}</Text>
                  </Card>
                ))
              ) : (
                <Text c="dimmed" fz="sm">No activity found.</Text>
              )}
            </Tabs.Panel>
          </Tabs>
        </Box>
      </Group>
    </Box>
  );
};

CompanyShow.layout = (page) => <Layout title="Company Overview">{page}</Layout>;

export default CompanyShow;
