import { ComponentProps, FC, Fragment, MouseEvent, useMemo } from "react";

import { Transition } from "@headlessui/react";
import * as Dialog from "@radix-ui/react-dialog";

import tw from "../../tw";
import { Button } from "../Button";
import { DialogTriggerProps } from "../Dialog";
import {
  DialogStateProvider,
  useDialogStateContiner,
} from "../Dialog/Dialog.state";

const StyledDialogContent = tw(Dialog.Content)`
  modal-box modal-open
  fixed z-50
  grid gap-2
  top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]
`;

type DivElement = JSX.IntrinsicElements["div"];

interface BaseModalProps extends DivElement, Dialog.DialogProps {
  hideCloseButton?: boolean;
  disableCloseButton?: boolean;
}

export type ModalProps = BaseModalProps & DialogTriggerProps;

const ModalRoot: FC<ModalProps> = ({
  modal,
  onOpenChange,
  defaultOpen,
  hideCloseButton,
  disableCloseButton,
  ...props
}) => {
  const [state, actions] = useDialogStateContiner();

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
      return;
    }
    if (open) {
      actions.open();
    } else {
      actions.close();
    }
  };

  const trigger = useMemo(
    () =>
      "trigger" in props ? (
        <Dialog.Trigger asChild onClick={actions.open}>
          {props.trigger}
        </Dialog.Trigger>
      ) : "triggerLabel" in props ? (
        <Dialog.Trigger asChild onClick={actions.open}>
          <Button>{props.triggerLabel}</Button>
        </Dialog.Trigger>
      ) : "renderTrigger" in props ? (
        props.renderTrigger?.({
          onClick: actions.open,
        })
      ) : null,
    [props],
  );

  return (
    <Dialog.Root
      {...{
        modal,
        open: state.isOpen,
        onOpenChange: handleOpenChange,
        defaultOpen,
      }}
    >
      {trigger}
      <Transition.Root show={state.isOpen}>
        <Dialog.Portal>
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
              className="fixed inset-0 z-20 bg-black/25 backdrop-blur-sm"
            />
          </Transition.Child>
          <Transition.Child
            as={StyledDialogContent}
            forceMount
            enter="ease-out duration-150"
            enterFrom="opacity-0 scale-75"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-75"
          >
            {!hideCloseButton && (
              <Dialog.Close asChild>
                <Button
                  $size="sm"
                  $shape="circle"
                  className="absolute right-2 top-2"
                  disabled={disableCloseButton}
                >
                  ✕
                </Button>
              </Dialog.Close>
            )}
            {props.children}
          </Transition.Child>
        </Dialog.Portal>
      </Transition.Root>
    </Dialog.Root>
  );
};

ModalRoot.defaultProps = {
  triggerLabel: "Open Modal",
};

const ModalRootWithProvider = (props: ModalProps) => (
  <DialogStateProvider initialState={props.open ?? props.defaultOpen}>
    <ModalRoot {...props} />
  </DialogStateProvider>
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
    const [, actions] = useDialogStateContiner();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(e);
      actions.close();
    };

    return (
      <Dialog.Close asChild onClick={handleClick}>
        <Button {...props} />
      </Dialog.Close>
    );
  },
});
