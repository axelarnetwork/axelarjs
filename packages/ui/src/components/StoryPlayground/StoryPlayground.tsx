import type { CapitalizeKeys } from "@axelarjs/utils";
import { ComponentProps, FC, ReactNode, useState } from "react";

import type { StoryFn } from "@storybook/react";

import { cn } from "../../utils";
import { Card } from "../Card";
import { ThemeSwitcher } from "../ThemeSwitcher";

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
      getChildren?: (props: ComponentProps<TComponent>[TKey]) => ReactNode;
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

const VIEWPORTS = {
  phone1: {
    className: "phone-1",
  },
  // phone2: {
  //   className: "phone-2",
  // },
  // phone3: {
  //   className: "phone-3",
  // },
  phone4: {
    className: "phone-4",
  },
  phone5: {
    className: "phone-5",
  },
  // phone6: {
  //   className: "phone-6",
  // },
  desktop: {
    className: "desktop",
  },
};

type Viewport = keyof typeof VIEWPORTS;

const VIEW_OPTIONS = Object.keys(VIEWPORTS) as Viewport[];

const ARTBOARD_OPTIONS = [
  "phone-1",
  "phone-2",
  "phone-3",
  "phone-4",
  "phone-5",
  "phone-6",
  "desktop",
] as const;

type Artboard = (typeof ARTBOARD_OPTIONS)[number];

const Variants = <
  TComponent extends FC,
  TComponentProps extends ComponentProps<TComponent>
>(
  props: VariantsProps<TComponent, TComponentProps>
) => {
  const [view, setView] = useState<Viewport>("desktop");

  const viewports = ARTBOARD_OPTIONS.reduce(
    (acc, artboard) => ({
      ...acc,
      [artboard]: artboard === VIEWPORTS[view].className,
    }),
    {} as Record<Artboard, boolean>
  );

  return (
    <div className="relative inline-block p-14">
      <section className="absolute right-2 top-2 flex items-center gap-2 p-2.5">
        <div className="btn-group">
          {VIEW_OPTIONS.map((device) => (
            <input
              key={device}
              type="radio"
              name="viewports"
              data-title={device.split("-").join(" ")}
              className="btn btn-sm"
              onClick={setView.bind(null, device)}
            />
          ))}
        </div>
        <ThemeSwitcher />
      </section>
      <Card className="bg-base-200 inline-grid overflow-x-scroll p-4 transition-all duration-300">
        <Card.Body className="grid gap-8">
          <Card.Title>
            {props.variant.title ?? capitalize(props.propKey)}{" "}
            <span className="text-base-content/75">/</span>{" "}
            {props.variant.values.map((value) => (
              <small key={value} className="badge badge-info badge-sm">
                {value}
              </small>
            ))}
          </Card.Title>

          <div
            className={cn(
              "artboard artboard-demo bg-base-300 mx-auto p-4 transition-all duration-300",
              { ...viewports }
            )}
          >
            <ul className="flex flex-wrap items-center gap-4">
              {props.variant.values.map((value) => {
                const itemProps = {
                  [props.propKey]: value,
                  ...props.defaultProps,
                  ...("noChildren" in props.variant
                    ? {}
                    : {
                        children:
                          props.variant.getChildren?.(value) ?? String(value),
                      }),
                };

                return (
                  <li key={value}>
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
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

const Template: StoryFn<typeof Variants> = (args) => <Variants {...args} />;

export const configurePlayground = <
  TComponent extends FC,
  TComponentProps extends ComponentProps<TComponent>
>(
  component: FC<TComponentProps>,
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
