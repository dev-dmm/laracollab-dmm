import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  MediaQuery,
  useMantineTheme,
} from "@mantine/core";
import { Head, usePage } from "@inertiajs/react";

import FlashNotification from "@/components/FlashNotification";
import Notifications from "@/layouts/Notifications";
import useWebSockets from "@/hooks/useWebSockets";
import useNotificationsStore from "@/hooks/store/useNotificationsStore";
import useAuthorization from "@/hooks/useAuthorization";
import NavBarNested from "@/layouts/NavBarNested";

export default function MainLayout({ children, title }) {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();
  const { initUserWebSocket } = useWebSockets();
  const { notifications } = usePage().props.auth;
  const { setNotifications } = useNotificationsStore();

  window.can = useAuthorization().can;

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
      header={{
        height: 60,
      }}
    >
      <Head title={title} />

      <AppShell.Header>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
            style={{ marginLeft: "1rem", marginTop: "1rem" }}
          />
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
