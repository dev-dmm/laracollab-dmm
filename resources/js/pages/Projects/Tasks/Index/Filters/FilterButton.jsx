import { Button, rem } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import classes from "./css/FilterButton.module.css";

export default function FilterButton({ selected, children, ...props }) {
  return (
    <Button
      className={classes.button}
      variant={selected ? "filled" : "default"}
      radius="md"
      justify="flex-start"
      size="xs"
      px="md"
      fullWidth={false} // ensures it doesn't stretch
      leftSection={
        <IconCheck
          stroke={2}
          opacity={selected ? 1 : 0.2}
          radius="xl"
          style={{
            width: rem(13),
            height: rem(13),
            marginLeft: rem(3),
            marginRight: rem(3),
          }}
        />
      }
      style={{ height: rem(32), whiteSpace: "nowrap" }}
      {...props}
    >
      {children}
    </Button>
  );
}
