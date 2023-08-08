import { forwardRef } from "react";

import { useCopyToClipboard } from "../../hooks";
import { cn } from "../../utils";
import { Button, ButtonProps } from "../Button";
import { CheckCircleIcon, CopyIcon } from "../icons/lucide";

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
      className={cn("flex items-center gap-2", className)}
      onClick={handleCopy.bind(null, textToCopy)}
      {...props}
      ref={ref}
    >
      {children ?? textToCopy}

      <div
        className={cn("swap swap-rotate", {
          "swap-active": isCopied,
        })}
      >
        <CheckCircleIcon
          className={cn(
            "swap-on h-[1em] w-[1em]",
            props.color === "success" ? "text-success-content" : "text-success"
          )}
        />
        <CopyIcon className={cn("swap-off", "h-[1em] w-[1em]")} />
      </div>
    </Button>
  );
});

CopyToClipboardButton.defaultProps = {
  size: "md",
};
