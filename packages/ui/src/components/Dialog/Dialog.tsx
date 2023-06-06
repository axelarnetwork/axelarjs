import { ComponentProps, FC, useEffect, useRef } from "react";

import tw from "tailwind-styled-components";

import { Button, ButtonProps } from "../Button";
import { DialogStateProvider, useDialogStateContiner } from "./Dialog.state";

const StyledDialog = tw.dialog`
  modal modal-bottom sm:modal-middle
`;

type PolymorphicProps =
  | {
      trigger: JSX.Element;
    }
  | {
      triggerLabel: JSX.Element;
    }
  | {
      renderTrigger: (props: { onClick: () => void }) => JSX.Element;
    };

export type DialogProps = ComponentProps<typeof StyledDialog> & {
  defaultOpen?: boolean;
} & PolymorphicProps;

const DialogRoot: FC<DialogProps> = (props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [state, actions] = useDialogStateContiner();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        actions.close();
      }
    };
    if (state.isOpen) {
      addEventListener("keydown", handler);
    } else {
      dialogRef.current?.close();
    }
    return () => {
      removeEventListener("keydown", handler);
    };
  }, [state.isOpen]);

  return (
    <>
      {"renderTrigger" in props ? (
        props.renderTrigger({ onClick: actions.open })
      ) : "trigger" in props ? (
        props.trigger
      ) : (
        <Button onClick={actions.open}>{props.triggerLabel}</Button>
      )}
      <StyledDialog ref={dialogRef} open={state.isOpen} onClose={actions.close}>
        {props.children}
      </StyledDialog>
    </>
  );
};

const DialogRootWithProvider: FC<DialogProps> = ({ children, ...props }) => (
  <DialogStateProvider initialState={props.open ?? props.defaultOpen}>
    <DialogRoot {...props}>{children}</DialogRoot>
  </DialogStateProvider>
);

const DialogCloseAction: FC<ButtonProps> = ({ ref, onClick, ...props }) => {
  const [, actions] = useDialogStateContiner();

  return (
    <Button
      {...props}
      onClick={(e) => {
        actions.close();
        onClick?.(e);
      }}
    >
      {props.children}
    </Button>
  );
};

export const Dialog = Object.assign(DialogRootWithProvider, {
  Body: tw.form`modal-box`,
  Title: tw.h2`font-bold text-xl`,
  CornerCloseAction: DialogCloseAction.bind({}),
  CloseAction: DialogCloseAction.bind({}),
  Actions: tw.div`modal-action justify-between`,
});

Dialog.defaultProps = {};

Dialog.Body.defaultProps = {};

Dialog.CornerCloseAction.defaultProps = {
  shape: "circle",
  variant: "ghost",
  children: "✕",
  size: "sm",
  className: "absolute top-2 right-2",
};

Dialog.Body.defaultProps = {
  method: "dialog",
};

Dialog.CloseAction.defaultProps = {
  children: "Close",
};
