import {
  ComponentProps,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from "react";

import tw from "../../tw";
import { Button, ButtonProps } from "../Button";
import { DialogStateProvider, useDialogStateContiner } from "./Dialog.state";

const StyledDialog = tw.dialog`
  modal modal-bottom sm:modal-middle
`;

export type DialogTriggerProps =
  | {
      trigger?: JSX.Element;
    }
  | {
      triggerLabel?: ReactNode;
    }
  | {
      renderTrigger?: (props: { onClick: () => void }) => JSX.Element;
    };

interface BaseDialogProps extends ComponentProps<typeof StyledDialog> {
  defaultOpen?: boolean;
  onClose?: () => void;
}

export type DialogProps = BaseDialogProps & DialogTriggerProps;

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

  const trigger = useMemo(
    () =>
      "renderTrigger" in props ? (
        props.renderTrigger?.({ onClick: actions.open })
      ) : "triggerLabel" in props ? (
        <Button onClick={actions.open}>{props.triggerLabel}</Button>
      ) : "trigger" in props ? (
        props.trigger
      ) : null,
    [props]
  );

  return (
    <>
      {trigger}
      <StyledDialog
        ref={dialogRef}
        open={state.isOpen}
        onClose={() => {
          actions.close();
          props.onClose?.();
        }}
      >
        {state.isOpen && <div className="modal-backdrop bg-base-300/50" />}
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

const DialogCloseAction: FC<Omit<ButtonProps, "ref">> = ({
  onClick,
  ...props
}) => {
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
