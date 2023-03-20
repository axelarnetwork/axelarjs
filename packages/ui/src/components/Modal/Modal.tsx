import { FC } from "react";

// @ts-ignore
import * as Dialog from "@radix-ui/react-dialog";
import tw from "tailwind-styled-components";

import { Button } from "../Button";

const StyledDialogOverlay = tw(Dialog.Overlay)`
  fixed
  inset-0
  animationOverlayShow
  bg-slate-500/25
`;

const StyledDialogContent = tw(Dialog.Content)`
  fixed
  top-2/4
  left-2/4
  -translate-y-2/4
  -translate-x-2/4
  p-5
  w-9/12
  rounded-xl
  animationContentShow
  bg-base-100
`;

export type ModalProps = JSX.IntrinsicElements["div"] & {};

export const Modal: FC<ModalProps> = ({ children, ...props }) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <Button>Open</Button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <StyledDialogOverlay />
      <StyledDialogContent>
        {children}
        <Dialog.Close asChild>
          <Button>Close</Button>
        </Dialog.Close>
      </StyledDialogContent>
    </Dialog.Portal>
  </Dialog.Root>
);
