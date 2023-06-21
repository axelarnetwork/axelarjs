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
  info: <Info className="h-6 w-6" />,
  success: <CheckCircle className="h-6 w-6" />,
  warning: <AlertTriangle className="h-6 w-6" />,
  error: <XCircle className="h-6 w-6" />,
};

/**
 * This is an alert component
 *
 * @param {string} props.status - The status of the alert
 * @param {ReactNode} props.icon - The icon of the alert
 * @param {string} props.className - The class name of the alert
 * @param {ReactNode} props.children - The children of the alert
 *
 * @returns {JSX.Element}
 *
 * @example
 * <Alert status="info" icon={<Info className="h-6 w-6" />}>
 *  This is an alert
 * </Alert>
 */
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
