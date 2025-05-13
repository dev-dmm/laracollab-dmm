import { useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import {
  AppShell,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import FlashNotification from "@/components/FlashNotification";
import Notifications from "@/layouts/Notifications";
import NavBarNested from "@/layouts/NavBarNested";

import useAuthorization from "@/hooks/useAuthorization";
import useWebSockets from "@/hooks/useWebSockets";
import useNotificationsStore from "@/hooks/store/useNotificationsStore";

export default function MainLayout({ children, title }) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [opened, { toggle }] = useDisclosure();

  const { initUserWebSocket } = useWebSockets();
  const { notifications } = usePage().props.auth;
  const { setNotifications } = useNotificationsStore();

  // make `can()` globally available
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
    >
      <Head title={title} />

      {/* Optional minimal mobile header with burger */}
      {isMobile && (
        <AppShell.Header
          style={{
            height: 60,
            display: "flex",
            alignItems: "center",
            padding: "0 1rem",
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[7]
                : theme.white,
            borderBottom: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[3]
            }`,
            zIndex: 100,
          }}
        >
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            color={theme.colors.gray[6]}
          />
        </AppShell.Header>
      )}

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
