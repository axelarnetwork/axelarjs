import { FC, forwardRef } from "react";

import clsx from "clsx";
import { CheckCircle, ClipboardCopy } from "lucide-react";

import { useCopyToClipboard } from "../../hooks";
import { Button, ButtonProps } from "../Button";

export type CopyToClipboardButtonProps = Omit<
  ButtonProps,
  "onClick" | "$as"
> & {
  copyText?: string;
  copyTimeout?: number;
  onCopied?: () => void;
};

export const CopyToClipboardButton = forwardRef<
  HTMLButtonElement,
  CopyToClipboardButtonProps
>(({ copyText, onCopied, children, className, ...props }, ref) => {
  const [copied, copy] = useCopyToClipboard({
    timeout: 2000,
  });

  const textToCopy =
    typeof children === "string" && !copyText ? children : copyText;

  const handleCopy = (text = "") => {
    if (!text) {
      throw new Error(
        "[CopyToClipboardButton]: missing props 'copyText' or string children"
      );
    }
    copy(text ?? "");
    onCopied?.();
  };
  const isCopied = copied === textToCopy;

  return (
    <Button
      className={clsx("flex items-center gap-2", className)}
      onClick={handleCopy.bind(null, textToCopy)}
      {...props}
      ref={ref}
    >
      {children ?? textToCopy}

      <div
        className={clsx("swap swap-rotate", {
          "swap-active": isCopied,
        })}
      >
        <CheckCircle
          className={clsx(
            "swap-on h-[1em] w-[1em]",
            props.color === "success" ? "text-success-content" : "text-success"
          )}
        />
        <ClipboardCopy className={clsx("swap-off", "h-[1em] w-[1em]")} />
      </div>
    </Button>
  );
});

CopyToClipboardButton.defaultProps = {
  size: "md",
};
