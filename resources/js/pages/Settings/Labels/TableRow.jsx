import TableRowActions from "@/components/TableRowActions";
import { ColorSwatch, Table, Text } from "@mantine/core";

export default function TableRow({ item }) {
  return (
    <Table.Tr key={item.id}>
      <Table.Td w={80}>
        <ColorSwatch color={item.color} />
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.name}</Text>
      </Table.Td>
      {(can("edit label") || can("archive label") || can("restore label")) && (
        <Table.Td w={100}>
          <TableRowActions
            item={item}
            editRoute="settings.labels.edit"
            editPermission="edit label"
            archivePermission="archive label"
            restorePermission="restore label"
            archive={{
              route: "settings.labels.destroy",
              title: "Αρχειοθέτηση ετικέτας",
              content: "Είσαι σίγουρος/η ότι θέλεις να αρχειοθετήσεις αυτή την ετικέτα;",
              confirmLabel: "Αρχειοθέτηση",
            }}
            restore={{
              route: "settings.labels.restore",
              title: "Επαναφορά ετικέτας",
              content: "Είσαι σίγουρος/η ότι θέλεις να επαναφέρεις αυτή την ετικέτα;",
              confirmLabel: "Επαναφορά",
            }}
          />
        </Table.Td>
      )}
    </Table.Tr>
  );
}
