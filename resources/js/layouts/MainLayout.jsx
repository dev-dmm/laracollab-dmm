import FlashNotification from "@/components/FlashNotification";
import useNotificationsStore from "@/hooks/store/useNotificationsStore";
import useAuthorization from "@/hooks/useAuthorization";
import useWebSockets from "@/hooks/useWebSockets";
import NavBarNested from "@/layouts/NavBarNested";
import Notifications from "@/layouts/Notifications";
import { Head, usePage } from "@inertiajs/react";
import { AppShell } from "@mantine/core";
import { useEffect } from "react";

export default function MainLayout({ children, title }) {
  window.can = useAuthorization().can;
  const { initUserWebSocket } = useWebSockets();
  const { notifications } = usePage().props.auth;
  const { setNotifications } = useNotificationsStore();

  const [opened, { toggle }] = useDisclosure();

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
        collapsed: { mobile: !opened },
      }}
      navbarOffsetBreakpoint="sm"
      withBorder={false}
      asideOffsetBreakpoint="sm"
    >
      <Head title={title} />

      <AppShell.Header>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger opened={opened} onClick={toggle} size="sm" ml="md" />
        </MediaQuery>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavBarNested />
      </AppShell.Navbar>

      <AppShell.Main>
        <FlashNotification />
        <Notifications />
        {children}
      </AppShell.Main>
    </AppShell>
  );
}