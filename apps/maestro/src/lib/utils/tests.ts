import type { ReactElement } from "react";

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const setupWithUserEvent = (jsx: ReactElement) => ({
  user: userEvent.setup(),
  ...render(jsx),
});
