import type { Meta, StoryFn } from "@storybook/react";

import { Steps } from "./Steps";

export default {
  title: "components/Steps",
  component: Steps,
  docs: {
    description: {
      component: "Steps, Steps, does whatever a Steps do.",
    },
  },
} as Meta<typeof Steps>;

const Template: StoryFn<typeof Steps> = (args) => {
  return <Steps {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  children: (
    <>
      <Steps.Step>Step 1</Steps.Step>
      <Steps.Step>Step 2</Steps.Step>
      <Steps.Step>Step 3</Steps.Step>
    </>
  ),
};

export const Vertical = Template.bind({});

Vertical.args = {
  direction: "vertical",
  color: "primary",
  children: (
    <>
      <Steps.Step active>Step 1</Steps.Step>
      <Steps.Step>Step 2</Steps.Step>
      <Steps.Step>Step 3</Steps.Step>
    </>
  ),
};

export const CustomContent = Template.bind({});

CustomContent.args = {
  direction: "vertical",
  color: "primary",
  children: (
    <>
      <Steps.Step active content="?">
        Step 1
      </Steps.Step>
      <Steps.Step active content="!">
        Step 2
      </Steps.Step>
      <Steps.Step content="✓">Step 3</Steps.Step>
    </>
  ),
};

export const AutoSteps = Template.bind({});

AutoSteps.args = {
  color: "primary",
  stepIndex: 2,
  totalSteps: 4,
};

export const AutoStepsWithPrefix = Template.bind({});

AutoStepsWithPrefix.args = {
  color: "primary",
  stepPrefix: "Step",
  stepIndex: 2,
  totalSteps: 4,
};
