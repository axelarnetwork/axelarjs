import { useState } from "react";

import { gray, mauve } from "@radix-ui/colors";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

import { WalletList } from "./WalletList";

const styles = {
  closeButton: {
    fontFamily: "inherit",
    padding: 0,
    border: "none",
    borderRadius: "100%",
    height: "25px",
    width: "25px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: gray.gray11,
    position: "absolute" as const,
    top: "10px",
    right: "10px",
    backgroundColor: "inherit",
    cursor: "pointer",
  },
  dialogOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "fixed" as const,
    inset: 0,
  },
  dialogContent: {
    zIndex: 50,
    backgroundColor: "white",
    borderRadius: "6px",
    boxShadow:
      "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90vw",
    maxWidth: "450px",
    maxHeight: "85vh",
    padding: "25px",
  },
  dialogTitle: {
    margin: 0,
    textAlign: "center" as const,
    fontWeight: 500,
    color: mauve.mauve11,
    fontSize: "1.5em",
  },
};

type Props = {
  trigger: React.ReactNode;
};

export const ConnectModal = ({ trigger }: Props) => {
  const [open, setOpen] = useState(false);

  const handleConnectSuccess = () => {
    setOpen(false);
  };
  const handleConnectError = (error: any) => {
    console.error(error.message);
    setOpen(false);
  };

  const preventOpenAutoFocus = (e: Event) => {
    e.preventDefault();
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay style={styles.dialogOverlay} />
        <Dialog.Content
          style={styles.dialogContent}
          aria-describedby={undefined}
          onOpenAutoFocus={preventOpenAutoFocus}
        >
          <Dialog.Title style={styles.dialogTitle}>Connect to</Dialog.Title>
          <Dialog.Description />
          <WalletList
            onConnectSuccess={handleConnectSuccess}
            onConnectError={handleConnectError}
          />
          <Dialog.Close asChild>
            <button style={styles.closeButton} aria-label="Close">
              <Cross2Icon width={24} height={24} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
