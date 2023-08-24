import type { ComponentProps, FC, ReactNode } from "react";

import { cva, VariantProps } from "class-variance-authority";
import tw from "tailwind-styled-components";

import { cn } from "../../utils";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon,
} from "../icons/lucide";

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
  info: <InfoIcon className="h-6 w-6" />,
  success: <CheckCircleIcon className="h-6 w-6" />,
  warning: <AlertTriangleIcon className="h-6 w-6" />,
  error: <XCircleIcon className="h-6 w-6" />,
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
      className={cn(alertVariance({ status }), className)}
      {...props}
    >
      <div className={!status ? "text-info" : ""}>
        {icon ?? ICON_MAP[status ?? "info"]}
      </div>
      <div className="w-full">{children}</div>
    </StyledAlert>
  );
};
