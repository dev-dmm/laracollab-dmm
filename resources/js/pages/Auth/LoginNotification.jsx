import { Alert } from "@mantine/core";
import {
  IconInfoCircle,
  IconAlertTriangle,
  IconExclamationCircle,
} from "@tabler/icons-react";

export default function LoginNotification({ notify }) {
  return (
    <div style={{ marginTop: "25px" }}>
      {notify === "password-reset" && (
        <Alert radius="md" title="Ο κωδικός άλλαξε" icon={<IconInfoCircle />}>
          Ο κωδικός σας ενημερώθηκε με επιτυχία. Μπορείτε να συνδεθείτε με τον νέο σας κωδικό.
        </Alert>
      )}
      {notify === "social-login-user-not-found" && (
        <Alert
          radius="md"
          title="Αποτυχία σύνδεσης"
          icon={<IconAlertTriangle />}
          color="orange"
        >
          Δεν βρέθηκε χρήστης με αυτό το email από την Google.
        </Alert>
      )}
      {notify === "social-login-failed" && (
        <Alert
          radius="md"
          title="Ουπς, κάτι πήγε στραβά"
          icon={<IconExclamationCircle />}
          color="red"
        >
          Παρουσιάστηκε απρόσμενο σφάλμα. Δοκιμάστε να συνδεθείτε με email και κωδικό.
        </Alert>
      )}
    </div>
  );
}
