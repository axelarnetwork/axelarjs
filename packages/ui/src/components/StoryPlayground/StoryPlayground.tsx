import { ComponentProps, FC } from "react";

import { StoryFn } from "@storybook/react";

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase().concat(str.slice(1));

const Variants: FC<{
  propKey: string;
  values: (string | number | boolean)[];
  component: FC;
  defaultProps?: Record<string, unknown>;
}> = (props) => (
  <section className="grid gap-2">
    <h1 className="text-lg">
      {capitalize(props.propKey)} / <small>{props.values.join(", ")}</small>
    </h1>
    <ul className="flex items-center gap-2">
      {props.values.map((value) => (
        // @ts-ignore
        <props.component
          key={String(value)}
          {...{ [props.propKey]: value }}
          {...props.defaultProps}
        >
          {String(value)}
        </props.component>
      ))}
    </ul>
  </section>
);

const Template: StoryFn<typeof Variants> = (args) => <Variants {...args} />;

export const configurePlayground = <
  TComponent extends FC,
  TComponentProps extends ComponentProps<TComponent>
>(
  component: React.FC<TComponentProps>,
  variants: {
    [TKey in keyof TComponentProps]: TComponentProps[TKey][];
  },
  defaultProps?: Partial<TComponentProps>
) => {
  return Object.entries(variants).reduce((acc, [propKey, values]) => {
    const componentStory = Template.bind({});
    // @ts-ignore
    componentStory.args = { propKey, values, component, defaultProps };

    return {
      ...acc,
      [capitalize(propKey)]: componentStory,
    };
  }, {} as Record<string, StoryFn<typeof Variants>>);
};
