import Layout from '@/layouts/MainLayout';
import { usePage } from '@inertiajs/react';
import { Group, Text, Card, ActionIcon, Tooltip, rem } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import classes from '@/pages/Projects/Tasks/Index/css/TaskGroup.module.css';

const CompanyStatusBoard = () => {
  const { statuses = [], companies = [] } = usePage().props;

  return (
    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: 20 }}>
      {statuses.map((status) => {
        const companiesWithStatus = companies.filter(
          (company) => company.status?.id === status.id
        );

        return (
          <div key={status.id} className={classes.row}>
            <div className={classes.group}>
              <Group justify="space-between" align="center">
                <Text size="xl" fw={700}>
                  {status.label}
                </Text>
                <Tooltip label="Add company" openDelay={1000} withArrow>
                  <ActionIcon
                    variant="filled"
                    size="md"
                    radius="xl"
                    onClick={() => alert(`Create company for status: ${status.label}`)}
                  >
                    <IconPlus style={{ width: rem(18), height: rem(18) }} stroke={2} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </div>

            <div>
              {companiesWithStatus.map((company) => (
                <Card key={company.id} shadow="sm" padding="sm" radius="md" mt="sm">
                  <Text fw={500}>{company.name}</Text>
                  <Text size="xs" color="dimmed">
                    {company.email || 'No email'}
                  </Text>
                </Card>
              ))}

              {companiesWithStatus.length === 0 && (
                <Text size="sm" color="dimmed" mt="sm">
                  No companies.
                </Text>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ✅ This is the missing piece for the sidebar!
CompanyStatusBoard.layout = (page) => <Layout title="Companies by Status">{page}</Layout>;

export default CompanyStatusBoard;
