import type { FC } from "react";

import clsx from "clsx";
import { CheckCircle, ClipboardCopy } from "lucide-react";

import { useCopyToClipboard } from "../../hooks";
import { Button, ButtonProps } from "../Button";

export type CopyToClipboardButtonProps = Omit<ButtonProps, "onClick"> & {
  copyText?: string;
  copyTimeout?: number;
  onCopied?: () => void;
};

export const CopyToClipboardButton: FC<CopyToClipboardButtonProps> = ({
  copyText,
  onCopied,
  children,
  className,
  ...props
}) => {
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

  const iconClassNames = clsx({
    "h-5 w-5": props.size === "lg",
    "h-4 w-4": props.size === "md",
    "h-3.5 w-3.5": props.size === "sm",
    "h-3 w-3": props.size === "xs",
  });

  return (
    <Button
      className={clsx("flex items-center gap-2", className)}
      onClick={handleCopy.bind(null, textToCopy)}
      {...props}
    >
      {children}

      <div
        className={clsx("swap swap-flip", {
          "swap-active": isCopied,
        })}
      >
        <ClipboardCopy className={clsx("swap-off", iconClassNames)} />
        <CheckCircle className={clsx("swap-on text-success", iconClassNames)} />
      </div>
    </Button>
  );
};
