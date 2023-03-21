import { ComponentProps, FC, ReactNode } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import tw from "tailwind-styled-components";

import { Button } from "../Button";

const StyledDialogContent = tw(Dialog.Content)`
  modal modal-open
`;

const StyledModalBody = tw.div`
  modal-box grid gap-2 animate-in slide-in-from-top-0
`;

type PolymorphicProps =
  | {
      trigger: ReactNode;
    }
  | {
      triggerLabel: ReactNode;
    };

export type ModalProps = JSX.IntrinsicElements["div"] & {
  hideCloseButton?: boolean;
} & PolymorphicProps;

const ModalRoot: FC<ModalProps> = ({ ...props }) => (
  <Dialog.Root>
    {"trigger" in props ? (
      <Dialog.Trigger asChild>{props.trigger}</Dialog.Trigger>
    ) : (
      <Dialog.Trigger asChild>
        <Button>{props.triggerLabel}</Button>
      </Dialog.Trigger>
    )}
    <Dialog.Portal>
      <Dialog.Overlay />
      <StyledDialogContent>
        <StyledModalBody>
          {!props.hideCloseButton && (
            <Dialog.Close className="btn btn-sm btn-circle absolute right-2 top-2">
              ✕
            </Dialog.Close>
          )}
          {props.children}
        </StyledModalBody>
      </StyledDialogContent>
    </Dialog.Portal>
  </Dialog.Root>
);

export const Modal = Object.assign(ModalRoot, {
  Body: tw.div``,
  Actions: tw.div`
    modal-action justify-between
  `,
  Title: tw(Dialog.Title)`
    font-bold
  `,
  Description: tw(Dialog.Description)`
    font-medium opacity-75 -mt-2
  `,
  CloseAction: (props: ComponentProps<typeof Button>) => (
    <Dialog.Close asChild>
      <Button {...props} />
    </Dialog.Close>
  ),
});

Modal.defaultProps = {
  triggerLabel: "Open Modal",
};
