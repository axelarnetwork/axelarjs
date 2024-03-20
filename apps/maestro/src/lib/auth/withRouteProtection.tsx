import type { ComponentType } from "react";

import {
  useRouteProtection,
  UseRouteProtectionProps,
} from "./useRouteProtection";

export function withRouteProtection<TProps = any>(
  PageComponent: ComponentType<TProps>,
  config = {
    redirectTo: "/",
    accountStatuses: ["enabled", "privileged"],
  } as UseRouteProtectionProps,
) {
  const Wrapped = (props: JSX.IntrinsicAttributes & TProps) => {
    useRouteProtection(config);

    return <PageComponent {...props} />;
  };

  Wrapped.displayName = `WithRouteProtection(${PageComponent.displayName})`;

  return Wrapped;
}
