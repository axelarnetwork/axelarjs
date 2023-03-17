import type { Meta, StoryFn } from "@storybook/react";

import { Footer } from "./Footer";

export default {
  title: "components/Footer",
  component: Footer,
  docs: {
    description: {
      component: "Footer, Footer, does whatever a Footer do.",
    },
  },
} as Meta<typeof Footer>;

const Template: StoryFn<typeof Footer> = (args) => {
  return <Footer {...args} />;
};

export const Default = Template.bind({});

Default.args = {};
