import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, useMantineTheme, rem } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Head, usePage } from "@inertiajs/react";
import { useEffect } from "react";

import FlashNotification from "@/components/FlashNotification";
import Notifications from "@/layouts/Notifications";
import useWebSockets from "@/hooks/useWebSockets";
import useNotificationsStore from "@/hooks/store/useNotificationsStore";
import useAuthorization from "@/hooks/useAuthorization";
import NavBarNested from "@/layouts/NavBarNested";
import Logo from "@/components/Logo";

export default function MainLayout({ children, title }) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
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
        header={{ height: 60 }} // ✅ This ensures header is consistent
        navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      >
      <Head title={title} />

      <AppShell.Header style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
        {isMobile && (
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            color={theme.colors.gray[6]}
          />
        )}
        {/* <div style={{ fontWeight: 600, marginLeft: '1rem' }}>LaraCollab</div> */}
        <Logo style={{ width: rem(120) }} />
      </AppShell.Header>

      <AppShell.Navbar>
        <NavBarNested></NavBarNested>
      </AppShell.Navbar>

      <AppShell.Main>
        <FlashNotification />
        <Notifications />
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
