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
      {(can("edit status") || can("archive status") || can("restore status")) && (
        <Table.Td w={100}>
          <TableRowActions
            item={item}
            editRoute="settings.statuses.edit"
            editPermission="edit status"
            archivePermission="archive status"
            restorePermission="restore status"
            archive={{
              route: "settings.statuses.destroy",
              title: "Αρχειοθέτηση κατάστασης",
              content: "Είσαι σίγουρος/η ότι θέλεις να αρχειοθετήσεις αυτή την κατάσταση;",
              confirmLabel: "Αρχειοθέτηση",
            }}
            restore={{
              route: "settings.statuses.restore",
              title: "Επαναφορά κατάστασης",
              content: "Είσαι σίγουρος/η ότι θέλεις να επαναφέρεις αυτή την κατάσταση;",
              confirmLabel: "Επαναφορά",
            }}
          />
        </Table.Td>
      )}
    </Table.Tr>
  );
}
