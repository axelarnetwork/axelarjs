import { createContainer } from "@axelarjs/utils/react";
import { FC, ReactNode, useState } from "react";

import { cva, VariantProps } from "class-variance-authority";
import { dec, inc, range } from "rambda";
import { twMerge } from "tailwind-merge";

const colorVariants = {
  primary: "step-primary",
  secondary: "step-secondary",
  accent: "step-accent",
  info: "step-info",
  warning: "step-warning",
  success: "step-success",
  error: "step-error",
};

const stepsVariance = cva("steps", {
  variants: {
    direction: {
      horizontal: "steps-horizontal",
      vertical: "steps-vertical",
    },
  },
});

type StepsVProps = VariantProps<typeof stepsVariance>;

const stepVariance = cva("step", {
  variants: {
    variant: {
      primary: "step-primary",
      secondary: "step-secondary",
      accent: "step-accent",
      info: "step-info",
      warning: "step-warning",
      success: "step-success",
      error: "step-error",
    },
  },
});

type StepVProps = VariantProps<typeof stepVariance>;

type PolymorphicProps =
  | {
      children: ReactNode;
    }
  | {
      children: never;
      /**
       * The current step, defaults to 0
       */
      stepIndex: number;
      /**
       * The total number of steps, defaults to 0
       */
      totalSteps: number;

      /**
       * The content to display for each step
       */
      stepPrefix?: ReactNode;
      /**
       * The variant for the active steps
       */
      variant?: keyof typeof colorVariants;
    };

interface BaseStepsProps
  extends Omit<JSX.IntrinsicElements["ul"], "children">,
    StepsVProps,
    StepVProps {}

export type StepsProps = BaseStepsProps & PolymorphicProps;

function useStepsState(initialState?: {
  stepIndex: number;
  variant: StepVProps["variant"];
}) {
  const [stepIndex, setStep] = useState(initialState?.stepIndex ?? 0);

  return [
    { stepIndex, variant: initialState?.variant ?? "primary" },
    {
      nextStep: () => setStep(inc),
      prevStep: () => setStep(dec),
    },
  ] as const;
}

const { Provider: StepsStateProvider, useContainer: useStepsStateContainer } =
  createContainer(useStepsState);

const StepsRoot: FC<StepsProps> = ({ className, direction, ...props }) => {
  return (
    <ul
      className={twMerge(
        stepsVariance({
          direction,
        }),
        className
      )}
    >
      {"totalSteps" in props
        ? range(0, props.totalSteps).map((i) => (
            <Step
              key={`step-${i}`}
              active={i <= props.stepIndex}
              variant={props.variant}
              content={String(i + 1)}
            >
              {props.stepPrefix && (
                <>
                  {props.stepPrefix} {i + 1}
                </>
              )}
            </Step>
          ))
        : props.children}
    </ul>
  );
};

const RootWithProvider: FC<StepsProps> = (props) => {
  const defaultColor = props.variant ?? "primary";

  const initialState =
    "stepIndex" in props
      ? {
          stepIndex: props.stepIndex,
          variant: defaultColor,
        }
      : {
          stepIndex: 0,
          variant: defaultColor,
        };
  return (
    <StepsStateProvider initialState={initialState}>
      <StepsRoot {...props} />
    </StepsStateProvider>
  );
};

type LiElement = JSX.IntrinsicElements["li"];

interface StapProps extends LiElement, StepVProps {
  /**
   * The content of the step, defaults to the index of the step
   */
  content?: string;
  /**
   * Whether the step is active
   */
  active?: boolean;
}

const Step: FC<StapProps> = ({
  className,
  content,
  active,
  variant,
  ...props
}) => {
  const [state] = useStepsStateContainer();

  return (
    <li
      data-content={content}
      className={twMerge(
        stepVariance(active ? { variant: state.variant } : {}),
        className
      )}
      {...props}
    />
  );
};

export const Steps = Object.assign(RootWithProvider, {
  Step,
});

Steps.defaultProps = {
  direction: "horizontal",
};
