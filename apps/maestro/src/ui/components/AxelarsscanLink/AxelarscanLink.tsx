import {
  AxelarWhiteIcon,
  LinkButton,
  type LinkButtonProps,
} from "@axelarjs/ui";
import { maskAddress } from "@axelarjs/utils";
import React, { type FC } from "react";

type Props = Omit<LinkButtonProps, "ref"> & {
  txHash: `0x${string}`;
};

const AxelarscanLink: FC<Props> = ({ txHash, ...props }) => {
  return (
    <LinkButton
      $size="sm"
      href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/gmp/${txHash}`}
      className="flex items-center gap-2"
      target="_blank"
      {...props}
    >
      view {maskAddress(txHash)} on axelarscan
      <AxelarWhiteIcon />
    </LinkButton>
  );
};

AxelarscanLink.displayName = "AxelarscanLink";

export default AxelarscanLink;
