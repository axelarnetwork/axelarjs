import { ComponentProps, FC } from "react";

import type { CapitalizeKeys } from "@axelarjs/utils";
import type { StoryFn } from "@storybook/react";

import { Card } from "../Card";

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase().concat(str.slice(1));

type PolymorphicVariantConfig<
  TComponent extends FC,
  TKey extends keyof ComponentProps<TComponent>
> =
  | {
      noChildren: true;
      getChildren?: never;
    }
  | {
      getChildren?: (
        props: ComponentProps<TComponent>[TKey]
      ) => React.ReactNode;
    };

type VariantConfig<
  TComponent extends FC,
  TKey extends keyof ComponentProps<TComponent>
> = {
  values: ComponentProps<TComponent>[TKey][];
  description?: string;
  title?: string;
} & PolymorphicVariantConfig<TComponent, TKey>;

type VariantConfigLike<TComponent extends FC> = VariantConfig<
  TComponent,
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  any
>;

type VariantsProps<
  TComponent extends FC,
  TComponentProps extends ComponentProps<TComponent>
> = {
  propKey: string;
  variant: VariantConfigLike<TComponent>;
  component: TComponent;
  defaultProps?: Partial<TComponentProps>;
};

const Variants = <
  TComponent extends FC,
  TComponentProps extends ComponentProps<TComponent>
>(
  props: VariantsProps<TComponent, TComponentProps>
) => (
  <Card className="bg-base-200 m-8 inline-grid">
    <Card.Body className="grid gap-4">
      <Card.Title>
        {props.variant.title ?? capitalize(props.propKey)}{" "}
        <span className="text-base-content/75">/</span>{" "}
        {props.variant.values.map((x) => (
          <small className="badge badge-info badge-sm">{x}</small>
        ))}
      </Card.Title>
      <ul className="flex flex-wrap items-center gap-4">
        {props.variant.values.map((value) => {
          const itemProps = {
            [props.propKey]: value,
            ...props.defaultProps,
            ...("noChildren" in props.variant
              ? {}
              : {
                  children: props.variant.getChildren?.(value) ?? String(value),
                }),
          };

          return (
            <li key={String(value)}>
              {"noChildren" in props.variant ? (
                <div>
                  <span className="label">{value}</span>
                  {/* @ts-ignore\ */}
                  <props.component {...itemProps} />
                </div>
              ) : (
                <>
                  {/* @ts-ignore\ */}
                  <props.component {...itemProps} />
                </>
              )}
            </li>
          );
        })}
      </ul>
    </Card.Body>
  </Card>
);

const Template: StoryFn<typeof Variants> = (args) => <Variants {...args} />;

export const configurePlayground = <
  TComponent extends FC,
  TComponentProps extends ComponentProps<TComponent>
>(
  component: React.FC<TComponentProps>,
  variants: {
    [TKey in keyof TComponentProps]: VariantConfigLike<TComponent>;
  },
  defaultProps?: Partial<TComponentProps>
) => {
  return Object.entries(variants).reduce((acc, [propKey, variant]) => {
    const componentStory = Template.bind({});
    // @ts-ignore
    componentStory.args = { propKey, variant, component, defaultProps };

    return {
      ...acc,
      [capitalize(propKey)]: componentStory,
    };
  }, {} as CapitalizeKeys<Record<keyof typeof variants, StoryFn<typeof Variants>>>);
};
