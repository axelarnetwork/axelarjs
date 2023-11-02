import { composeStories } from "@storybook/react";
import { render } from "@testing-library/react";

import * as stories from "./Table.stories";

const { Default } = composeStories(stories);

describe("Table", () => {
  it("renders Default component story without breaking", () => {
    const { container } = render(<Default />);
    expect(container).toBeVisible();
  });
});
