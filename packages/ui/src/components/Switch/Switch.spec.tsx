import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";
import { expect, it, describe } from "vitest";

import * as stories from "./Switch.stories";

const { Default } = composeStories(stories);

describe("Switch", () => {
  it("renders Default component story without breaking", () => {
    const { container } = render(<Default />);
    expect(container).toBeVisible();
  });
});
