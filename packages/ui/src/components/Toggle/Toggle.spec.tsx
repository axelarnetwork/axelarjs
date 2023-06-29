import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";

import { ThemeProvider } from "../ThemeSwitcher";
import * as stories from "./Toggle.stories";

const { Colors } = composeStories(stories);

describe("Toggle", () => {
  it("renders Colors component story without breaking", () => {
    const { container } = render(
      <ThemeProvider>
        <Colors />
      </ThemeProvider>
    );
    expect(container).toBeVisible();
  });
});
