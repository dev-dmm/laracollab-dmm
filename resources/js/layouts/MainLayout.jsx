import { useEffect, useState } from "react";
import { AppShell, Burger, Text } from "@mantine/core";
import { Head, usePage } from "@inertiajs/react";
import FlashNotification from "@/components/FlashNotification";
import useNotificationsStore from "@/hooks/store/useNotificationsStore";
import useAuthorization from "@/hooks/useAuthorization";
import useWebSockets from "@/hooks/useWebSockets";
import Notifications from "@/layouts/Notifications";
import Sidebar from "@/layouts/Sidebar"; // Not NavBarNested, use your Sidebar component

export default function MainLayout({ children, title }) {
  window.can = useAuthorization().can;

  const { initUserWebSocket } = useWebSockets();
  const { notifications } = usePage().props.auth;
  const { setNotifications } = useNotificationsStore();

  const [navbarOpened, setNavbarOpened] = useState(false);

  useEffect(() => {
    initUserWebSocket();
    setNotifications(notifications);
  }, []);

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !navbarOpened },
      }}
      header={{ height: 60 }}
    >
      <Head title={title} />

      <AppShell.Header>
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 1rem" }}>
          <Burger
            opened={navbarOpened}
            onClick={() => setNavbarOpened((o) => !o)}
            hiddenFrom="sm"
            size="sm"
          />
          <Text fw={700} ml="md">
            Dmm
          </Text>
        </div>
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar navbarOpened={navbarOpened} />
      </AppShell.Navbar>

      <FlashNotification />
      <Notifications />
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
