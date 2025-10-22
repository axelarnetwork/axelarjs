import { xrplChainConfig } from "~/config/chains";
import { scaleDecimals } from "./gas";
import * as xrpl from "xrpl";
import Decimal from "decimal.js";

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

export const withXRPLClient = async (callback: (client: xrpl.Client) => Promise<any>) => {
    let client;
    try {
        client = new xrpl.Client(xrplChainConfig.rpcUrls.default.http[0]);

        await client.connect();

        return await callback(client);
    } finally {
        if (client)
        {
            try {
                await client.disconnect();
            } catch (_) {
            // ignore this
            }
        }
    }
}

export const fetchXRPLBalance = async (address: string) => {
    return await withXRPLClient(async (client) => {
        const accountInfo = await client.request({
            command: "account_info",
            account: address,
        });
        // Balance is returned in drops (1 XRP = 1,000,000 drops)
        const drops = accountInfo.result.account_data.Balance;
        
        return drops;
    });
};

export const autofillXRPLTx = async (tx: xrpl.SubmittableTransaction) => {
    return await withXRPLClient(async (client) => {
        const preparedTx = await client.autofill(tx);
       
        return preparedTx;
    });
};

export const autofillAndSimulateXRPLTx = async (tx: xrpl.SubmittableTransaction) => {
    return await withXRPLClient(async (client) => {
        const preparedTx = await client.autofill(tx);
        const sim = await client.simulate(preparedTx);
        if (sim.result.engine_result_code !== 0) {
            throw Error(`Simulation failed: ${sim.result.engine_result_message}`);
        }
        return preparedTx;
    });
};

export const checkXRPLNode = async () => {
    try {
        return await withXRPLClient(async (client) => {
            const pingResponse = await client.request({
                command: "ping",
            });
            if (pingResponse.type !== "response") {
                return "down";
            }
            return "up";
        });
    } catch (error) {
        return "down";
    }
};

export const getXRPLAccountBalance = async (accountAddress: string, tokenAddress: string) => {
    if (tokenAddress === "XRP") {
        // fetch XRP balance
        const balanceInDrops = await fetchXRPLBalance(accountAddress);

        return {
            isTokenOwner: false,
            isTokenMinter: false,
            tokenBalance: balanceInDrops,
            decimals: 6,
            isTokenPendingOwner: false,
            hasPendingOwner: false,
            hasMinterRole: false,
            hasOperatorRole: false,
            hasFlowLimiterRole: false,
        };
    }

    const [currency, issuer] = tokenAddress.split(".");
    if (!currency || !issuer) {
        throw new Error("Invalid tokenAddress format for XRPL. Expected format is CURRENCY.ISSUER");
    }

    const response = await withXRPLClient(async (client) => {
        // the tokenAddress for xrpl is in the format of "CURRENCY.ISSUER"
        return await client.request({
            command: "account_lines",
            account: accountAddress,
        });
    });

    // Find the line that matches the token
    const line = response.result.lines.find(
        (l: { currency: string; account: string; }) => l.currency === currency && l.account === issuer
    );

    const XRPL_TOKEN_DECIMALS = 15;
    const actualBalance = line ? Decimal(line.balance).times(new Decimal(10).pow(XRPL_TOKEN_DECIMALS)).toFixed(0) : "0";

    return {
        isTokenOwner: false,
        isTokenMinter: false,
        tokenBalance: line ? actualBalance.toString() : "0",
        decimals: XRPL_TOKEN_DECIMALS,
        isTokenPendingOwner: false,
        hasPendingOwner: false,
        hasMinterRole: false,
        hasOperatorRole: false,
        hasFlowLimiterRole: false,
    }
}

export const isXRPLChainName = (chainName: string) => (chainName.includes("xrpl") && !chainName.includes("evm"));

export const isValidXRPLWalletAddress = (address: string) => (xrpl.isValidClassicAddress(address));
