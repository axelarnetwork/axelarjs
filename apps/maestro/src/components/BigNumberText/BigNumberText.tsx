import React from "react";

import { BigNumberish } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";

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
