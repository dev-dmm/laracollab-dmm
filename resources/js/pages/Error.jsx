import { Container, Title, Text, Button, Group } from "@mantine/core";
import classes from "./css/Error.module.css";
import { Head, router } from "@inertiajs/react";

export default function Error({ status }) {
  const title = {
    503: "Υπηρεσία μη διαθέσιμη",
    500: "Σφάλμα διακομιστή",
    404: "Η σελίδα δεν βρέθηκε",
    403: "Απαγορευμένη πρόσβαση",
  }[status];

  const description = {
    503: "Λυπούμαστε, πραγματοποιούμε συντήρηση. Παρακαλούμε προσπαθήστε ξανά σύντομα.",
    500: "Ουπς, κάτι πήγε στραβά στους διακομιστές μας.",
    404: "Λυπούμαστε, η σελίδα που αναζητάτε δεν βρέθηκε.",
    403: "Λυπούμαστε, δεν έχετε πρόσβαση σε αυτή τη σελίδα.",
  }[status];

  return (
    <>
      <Head title={title} />
      <Container className={classes.root}>
        <div className={classes.inner}>
          <div className={classes.image}>{status}</div>
          <div className={classes.content}>
            <Title className={classes.title}>{title}</Title>
            <Text
              c="dimmed"
              size="lg"
              ta="center"
              className={classes.description}
            >
              {description}
            </Text>
            <Group justify="center">
              <Button size="md" onClick={() => router.get(route("dashboard"))}>
                Επιστροφή στην αρχική σελίδα
              </Button>
            </Group>
          </div>
        </div>
      </Container>
    </>
  );
}
