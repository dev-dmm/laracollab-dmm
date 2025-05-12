import RoleBadge from "@/components/RoleBadge";
import TableRowActions from "@/components/TableRowActions";
import { money } from "@/utils/currency";
import { getInitials } from "@/utils/user";
import { Avatar, Flex, Group, Table, Text } from "@mantine/core";

export default function TableRow({ item }) {
  return (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar
            src={item.avatar}
            size={40}
            radius={40}
            color="blue"
            alt={item.name}
          >
            {getInitials(item.name)}
          </Avatar>
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
            <Text fz="xs" c="dimmed">
              {item.job_title}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td maw={200}>
        <Flex gap="sm" align="center" direction="row" wrap="wrap">
          {item.roles.map((role, index) => (
            <RoleBadge role={role} key={`role-${index}-${item.id}`} />
          ))}
        </Flex>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.email}</Text>
        <Text fz="xs" c="dimmed">
          Email
        </Text>
      </Table.Td>
      {can("view user rate") && (
        <Table.Td>
          <Text fz="sm">{money(item.rate)} / ώρα</Text>
          <Text fz="xs" c="dimmed">
            Αμοιβή
          </Text>
        </Table.Td>
      )}
      {(can("edit user") || can("archive user") || can("restore user")) && (
        <Table.Td>
          <TableRowActions
            item={item}
            editRoute="users.edit"
            editPermission="edit user"
            archivePermission="archive user"
            restorePermission="restore user"
            archive={{
              route: "users.destroy",
              title: "Αρχειοθέτηση χρήστη",
              content: `Είσαι σίγουρος/η ότι θέλεις να αρχειοθετήσεις αυτόν τον χρήστη; Αυτή η ενέργεια θα αποτρέψει
              τον χρήστη από το να συνδεθεί, αλλά όλες οι υπόλοιπες ενέργειές του θα παραμείνουν
              ανέπαφες.`,
              confirmLabel: "Αρχειοθέτηση",
            }}
            restore={{
              route: "users.restore",
              title: "Επαναφορά χρήστη",
              content: `Είσαι σίγουρος/η ότι θέλεις να επαναφέρεις αυτόν τον χρήστη; Με αυτή την ενέργεια θα μπορεί να συνδεθεί ξανά.`,
              confirmLabel: "Επαναφορά",
            }}
          />
        </Table.Td>
      )}
    </Table.Tr>
  );
}
