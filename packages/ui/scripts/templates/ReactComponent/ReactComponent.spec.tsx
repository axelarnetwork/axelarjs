import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";
import { expect, it, describe } from "vitest";

import * as stories from "./ReactComponent.stories";

const { Default } = composeStories(stories);

describe("ReactComponent", () => {
  it("renders Default component story without breaking", () => {
    const { container } = render(<Default />);
    expect(container).toBeVisible();
  });
});
