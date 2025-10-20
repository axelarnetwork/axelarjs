import { scaleDecimals } from "./gas";

export const xrplScaleGas = (
    isNativeSymbol: boolean,
    tokenDecimals: number | undefined,
    gas: bigint | undefined,
    gasFeeDecimals: number,
) => {
    if(isNativeSymbol) {
      // when we transfer XRP, this is already correct
    } else if (!tokenDecimals || !gas) {
      // this should not happen, but in this case just use zero gas (and recover later)
      gas = 0n;
    } else {
      // we need to map from tokenDetails.decimals to a rational number
      gas = scaleDecimals(gas, tokenDecimals, 15);

      gasFeeDecimals = 15;
    }
    return {gas, gasFeeDecimals}
};