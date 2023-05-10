import React from "react";

import type { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "ethers/lib/utils";

export type BigNumberTextProps = {
  children: BigNumberish;
  decimals?: number | string;
  locales?: Intl.LocalesArgument;
  localeOptions?: Intl.NumberFormatOptions;
};

const BigNumberText = (props: BigNumberTextProps) => {
  return (
    <>
      {Number(formatUnits(props.children, props.decimals)).toLocaleString(
        props.locales,
        props.localeOptions
      )}
    </>
  );
};

export default BigNumberText;
