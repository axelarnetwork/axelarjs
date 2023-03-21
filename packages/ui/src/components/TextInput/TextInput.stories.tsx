import type { Meta, StoryFn } from "@storybook/react";

import { TextInput, TextInputProps } from "./TextInput";

export default {
  title: "components/TextInput",
  component: TextInput,
  docs: {
    description: {
      component: "TextInput, TextInput, does whatever a TextInput do.",
    },
  },
} as Meta<typeof TextInput>;

const Template: StoryFn<typeof TextInput> = (args) => {
  return <TextInput {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  placeholder: "Placeholder",
};

const SizesTemplate: StoryFn<
  TextInputProps & {
    sizes: TextInputProps["inputSize"][];
  }
> = (args) => {
  return (
    <div className="card bg-base-200 w-full max-w-md">
      <ul className="card-body">
        {args.sizes.map((size) => (
          <li key={size} className="form-control">
            <TextInput inputSize={size} {...args} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Sizes = SizesTemplate.bind({});

Sizes.args = {
  placeholder: "Placeholder",
  sizes: ["xs", "sm", "md", "lg"],
};
