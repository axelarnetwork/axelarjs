import { ComponentProps, FC, Fragment, ReactNode, useState } from "react";

import { Transition } from "@headlessui/react";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import tw from "tailwind-styled-components";
import { createContainer } from "unstated-next";

import { Button } from "../Button";

const StyledDialogContent = tw(Dialog.Content)`
  modal
`;

const StyledModalBody = tw.div`
  modal-box grid gap-2 
`;

function useModalState(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return [isOpen, { open, close }] as const;
}

const { Provider: ModalStateProvider, useContainer: useModalStateContiner } =
  createContainer(useModalState);

type PolymorphicProps =
  | {
      trigger: ReactNode;
    }
  | {
      triggerLabel: ReactNode;
    };

export type ModalProps = JSX.IntrinsicElements["div"] &
  PolymorphicProps &
  Dialog.DialogProps & {
    hideCloseButton?: boolean;
  };

const ModalRoot: FC<ModalProps> = ({
  modal,
  open,
  onOpenChange,
  defaultOpen,
  hideCloseButton,
  ...props
}) => {
  const [isOpen, actions] = useModalStateContiner();

  return (
    <Dialog.Root {...{ modal, open, onOpenChange, defaultOpen }}>
      {"trigger" in props ? (
        <Dialog.Trigger asChild onClick={actions.open}>
          {props.trigger}
        </Dialog.Trigger>
      ) : (
        <Dialog.Trigger asChild onClick={actions.open}>
          <Button>{props.triggerLabel}</Button>
        </Dialog.Trigger>
      )}
      <Dialog.Portal>
        <Transition.Root show={isOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              forceMount
              className="fixed inset-0 z-20 bg-black/10"
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <StyledDialogContent
              className={clsx({
                "modal-open": isOpen,
              })}
            >
              <StyledModalBody>
                {!hideCloseButton && (
                  <Dialog.Close className="btn btn-sm btn-circle absolute right-2 top-2">
                    ✕
                  </Dialog.Close>
                )}
                {props.children}
              </StyledModalBody>
            </StyledDialogContent>
          </Transition.Child>
        </Transition.Root>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

ModalRoot.defaultProps = {
  triggerLabel: "Open Modal",
};

const ModalRootWithProvider = (props: ModalProps) => (
  <ModalStateProvider initialState={props.open ?? props.defaultOpen ?? false}>
    <ModalRoot {...props} />
  </ModalStateProvider>
);

export const Modal = Object.assign(ModalRootWithProvider, {
  Body: tw.div``,
  Actions: tw.div`
    modal-action justify-between
  `,
  Title: tw(Dialog.Title)`
    font-bold text-xl
  `,
  Description: tw(Dialog.Description)`
    font-medium opacity-75 -mt-2
  `,
  CloseAction: (props: ComponentProps<typeof Button>) => {
    const [, actions] = useModalStateContiner();
    return (
      <Dialog.Close asChild onClick={actions.close}>
        <Button {...props} />
      </Dialog.Close>
    );
  },
});
