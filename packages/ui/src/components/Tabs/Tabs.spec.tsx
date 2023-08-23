import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";

import * as stories from "./Tabs.stories";

const { Default } = composeStories(stories);

describe("Tabs", () => {
  it("renders Default component story without breaking", () => {
    const { container } = render(<Default />);
    expect(container).toBeVisible();
  });
});
