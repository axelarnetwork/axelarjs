import { composeStories } from "@storybook/react";
import { render } from "@testing-library/react";

import * as stories from "./AnimatedBlobBackground.stories";

const { Default } = composeStories(stories);

describe("AnimatedBlobBackground", () => {
  it("renders Default component story without breaking", () => {
    const { container } = render(<Default />);
    expect(container).toBeVisible();
  });
});

