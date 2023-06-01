import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./Identicon.stories";

const { Default } = composeStories(stories);

describe("Identicon", () => {
  it("renders Default component story without breaking", () => {
    const { container } = render(<Default />);
    expect(container).toBeVisible();
  });
});
