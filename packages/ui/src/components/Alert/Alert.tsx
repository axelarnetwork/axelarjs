import type { ComponentProps, FC, ReactNode } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";
import tw from "tailwind-styled-components";

const StyledAlert = tw.div``;

const alertVariance = cva("alert", {
  variants: {
    status: {
      info: "alert-info",
      success: "alert-success",
      warning: "alert-warning",
      error: "alert-error",
    },
  },
});

export type AlertProps = ComponentProps<typeof StyledAlert> &
  VariantProps<typeof alertVariance> & {
    icon?: ReactNode;
  };

const ICON_MAP: Record<NonNullable<AlertProps["status"]>, ReactNode> = {
  info: <Info />,
  success: <CheckCircle />,
  warning: <AlertTriangle />,
  error: <XCircle />,
};

export const Alert: FC<AlertProps> = ({
  status,
  icon,
  className,
  children,
  ...props
}) => {
  return (
    <StyledAlert
      className={twMerge(alertVariance({ status }), className)}
      {...props}
    >
      <span className={!status ? "text-info" : ""}>
        {icon ?? ICON_MAP[status ?? "info"]}
      </span>
      <span>{children}</span>
    </StyledAlert>
  );
};
