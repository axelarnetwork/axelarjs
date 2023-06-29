import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";

import * as stories from "./Loading.stories";

const { Default } = composeStories(stories);

describe("Loading", () => {
  it("renders Default component story without breaking", () => {
    const { container } = render(<Default />);
    expect(container).toBeVisible();
  });
});
