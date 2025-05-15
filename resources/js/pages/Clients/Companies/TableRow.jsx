import TableRowActions from '@/components/TableRowActions';
import { Link } from '@inertiajs/react';
import { Badge, Button, Group, Table, Text } from '@mantine/core';

export default function TableRow({ item }) {
  return (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text fz='sm' fw={500}>
          {item.name}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text fz='sm'>{item.email}</Text>
        <Text fz='xs' c='dimmed'>Email</Text>
      </Table.Td>

      <Table.Td>
        <Group gap='sm'>
          {item.clients.map(client => (
            <Link href={route('clients.users.edit', client.id)} key={client.id}>
              <Badge variant='light' color='orange' tt='unset'>
                {client.name}
              </Badge>
            </Link>
          ))}
        </Group>
      </Table.Td>

      <Table.Td>
        {item.status ? (
          <Badge variant="light" color={item.status.color || "gray"} tt="unset">
            {item.status.label}
          </Badge>
        ) : (
          <Badge variant="light" color="gray">Unknown</Badge>
        )}
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <Button
            size="xs"
            variant="light"
            color="blue"
            component={Link}
            href={route('clients.companies.show', item.id)} // 🔍 Adjust route if needed
          >
            View
          </Button>

          {(can('edit client company') ||
            can('archive client company') ||
            can('restore client company')) && (
            <TableRowActions
              item={item}
              editRoute='clients.companies.edit'
              editPermission='edit client company'
              archivePermission='archive client company'
              restorePermission='restore client company'
              archive={{
                route: 'clients.companies.destroy',
                title: 'Archive company',
                content: `Are you sure you want to archive this company?`,
                confirmLabel: 'Archive',
              }}
              restore={{
                route: 'clients.companies.restore',
                title: 'Restore company',
                content: `Are you sure you want to restore this company?`,
                confirmLabel: 'Restore',
              }}
            />
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}
