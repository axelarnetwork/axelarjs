import { composeStories } from "@storybook/react";
import { render } from "@testing-library/react";

import * as stories from "./CopyToClipboardButton.stories";

const { Default } = composeStories(stories);

describe("CopyToClipboardButton", () => {
  it("renders Default component story without breaking", () => {
    const { container } = render(<Default />);
    expect(container).toBeVisible();
  });
});
