import { usePage } from "@inertiajs/react";
import Layout from "@/layouts/MainLayout";
import { Card, Text, Title } from "@mantine/core";

export default function CompanyShow() {
  const { item } = usePage().props; // ← this is the company passed as `item`

  if (!item) {
    return <Text>Loading company details...</Text>; // ← fallback for undefined item
  }

  return (
    <Card withBorder shadow="sm" radius="md">
      <Title order={2}>{item.name}</Title>
      <Text>Email: {item.email || "—"}</Text>
      <Text>Phone: {item.phone || "—"}</Text>
      <Text>Address: {item.address || "—"}</Text>
      <Text>City: {item.city || "—"}</Text>
      <Text>Postal Code: {item.postal_code || "—"}</Text>
      <Text>Country: {item.country?.name || "—"}</Text>
      <Text>Currency: {item.currency?.name || "—"}</Text>
      <Text>Business ID: {item.business_id || "—"}</Text>
      <Text>VAT: {item.vat || "—"}</Text>
    </Card>
  );
}

CompanyShow.layout = (page) => <Layout title="Company Profile">{page}</Layout>;
