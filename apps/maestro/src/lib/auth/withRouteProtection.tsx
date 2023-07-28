import type { ComponentType } from "react";

import { useRouteProtection } from "./useRouteProtection";

export function withRouteProtection<TProps = any>(
  PageComponent: ComponentType<TProps>,
  redirectTo = "/"
) {
  const Wrapped = (props: JSX.IntrinsicAttributes & TProps) => {
    useRouteProtection({ redirectTo });

    return <PageComponent {...props} />;
  };

  Wrapped.displayName = `WithRouteProtection(${PageComponent.displayName})`;

  return Wrapped;
}
