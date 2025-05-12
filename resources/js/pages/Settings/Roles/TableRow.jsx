import TableRowActions from "@/components/TableRowActions";
import { Table, Text } from "@mantine/core";

export default function TableRow({ item }) {
  const isLocked = (role) => {
    return ["admin", "client"].includes(role);
  };

  return (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text fz="sm" tt="capitalize" c={isLocked(item.name) ? "blue" : ""}>
          {item.name}
        </Text>
      </Table.Td>
      <Table.Td w={165}>
        <Text fz="sm">{item.permissions_count}</Text>
      </Table.Td>
      {(can("edit role") || can("archive role") || can("restore role")) &&
        item.name !== "admin" && (
          <Table.Td w={100}>
            <TableRowActions
              item={item}
              editRoute="settings.roles.edit"
              editPermission="edit role"
              archivePermission="archive role"
              restorePermission="restore role"
              archive={{
                route: "settings.roles.destroy",
                title: "Αρχειοθέτηση ρόλου",
                content: "Είσαι σίγουρος/η ότι θέλεις να αρχειοθετήσεις αυτόν τον ρόλο;",
                confirmLabel: "Αρχειοθέτηση",
              }}
              restore={{
                route: "settings.roles.restore",
                title: "Επαναφορά ρόλου",
                content: "Είσαι σίγουρος/η ότι θέλεις να επαναφέρεις αυτόν τον ρόλο;",
                confirmLabel: "Επαναφορά",
              }}
            />
          </Table.Td>
        )}
    </Table.Tr>
  );
}
