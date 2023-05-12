import React from "react";

import { formatUnits } from "viem";

export type BigNumberTextProps = {
  children: bigint;
  decimals?: number;
  locales?: Intl.LocalesArgument;
  localeOptions?: Intl.NumberFormatOptions;
};

const BigNumberText = (props: BigNumberTextProps) => {
  return (
    <>
      {Number(formatUnits(props.children, props.decimals ?? 0)).toLocaleString(
        props.locales,
        props.localeOptions
      )}
    </>
  );
};

export default BigNumberText;
