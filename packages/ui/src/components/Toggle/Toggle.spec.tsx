import { composeStories } from "@storybook/react";
import { render } from "@testing-library/react";

import { ThemeProvider } from "../ThemeSwitcher";
import * as stories from "./Toggle.stories";

const { Variants } = composeStories(stories);

describe("Toggle", () => {
  it("renders Colors component story without breaking", () => {
    const { container } = render(
      <ThemeProvider>
        <Variants />
      </ThemeProvider>,
    );
    expect(container).toBeVisible();
  });
});
