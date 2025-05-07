import type { xdr } from "stellar-sdk";

export interface StellarITSContractClient {
  interchain_token_address: (params: {
    token_id: Buffer;
  }) => Promise<{ result: string }>;
  token_manager_address: (params: {
    token_id: Buffer;
  }) => Promise<{ result: string | null }>;
}

export interface StellarTokenContractClient {
  balance: (params: {
    id: string;
  }) => Promise<{ simulation: { result: { retval: xdr.ScVal } } }>;
  is_minter: (params: {
    minter: string;
  }) => Promise<{ simulation: { result: { retval: xdr.ScVal } } }>;
  owner: () => Promise<{ simulation: { result: { retval: xdr.ScVal } } }>;
  decimals: () => Promise<{ simulation: { result: { retval: xdr.ScVal } } }>;
}
