import type { ComponentProps } from "react";

import tw from "../../tw";

/**
 * A progress component
 *
 * @param {ProgressProps} props
 * @returns {JSX.Element}
 *
 * @example
 
 * <Progress variant="accent" value={10} max={25} />
 */
export const Progress = tw.progress.cva("progress", {
  variants: {
    variant: {
      primary: "progress-primary",
      secondary: "progress-secondary",
      accent: "progress-accent",
      info: "progress-info",
      success: "progress-success",
      warning: "progress-warning",
      error: "progress-error",
    },
  },
});

export type ProgressProps = ComponentProps<typeof Progress>;
