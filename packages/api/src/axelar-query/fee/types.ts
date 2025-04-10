import { TokenUnit, type L2Type } from "../../gmp";

export type EstimateL1FeeParams = {
  executeData: `0x${string}`;
  l1GasPrice: TokenUnit;
  l1GasOracleAddress?: `0x${string}` | undefined;
  l2Type?: L2Type;
};
