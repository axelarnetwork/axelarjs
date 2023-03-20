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

const StyledActionButtons = tw.div`
  flex
  flex-row
  justify-between
`;

export type ModalProps = JSX.IntrinsicElements["div"] & {
  onCancel: () => void;
  onCancelText?: string;
  onConfirm?: () => void;
  onConfirmText: string;
};

export const Modal: FC<ModalProps> = ({
  children,
  onCancel,
  onConfirm,
  onCancelText = "Back",
  onConfirmText = "Close",
  ...props
}) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <Button>Open</Button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <StyledDialogOverlay />
      <StyledDialogContent>
        {children}
        <StyledActionButtons>
          {onCancel && (
            <Dialog.Close asChild>
              <Button onClick={onCancel}>{onCancelText}</Button>
            </Dialog.Close>
          )}
          <Dialog.Close asChild>
            <Button onClick={onConfirm}>{onConfirmText}</Button>
          </Dialog.Close>
        </StyledActionButtons>
      </StyledDialogContent>
    </Dialog.Portal>
  </Dialog.Root>
);
