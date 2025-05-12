import { Center, Group, Text, rem, useComputedColorScheme } from "@mantine/core";
import { IconChartArcs } from "@tabler/icons-react";

export default function Logo(props) {
  const computedColorScheme = useComputedColorScheme();

  return (
    <Group wrap="nowrap" {...props}>
      <Center
        bg={computedColorScheme === "dark" ? "blue.8" : "blue.9"}
        p={5}
        style={{ borderRadius: "100%" }}
      >
        <IconChartArcs style={{ stroke: "#fff", width: rem(25), height: rem(25), flexShrink: 0 }} />
      </Center>
      <Text fz={20} fw={600}>
<<<<<<< HEAD
        Dmm
=======
        DMM
>>>>>>> 45ecce8f0712f6b0c86d3107921a57d5c6a319c1
      </Text>
    </Group>
  );
}
