import { type WalletAccount } from '../core';
export declare class XRPLWalletAccount implements WalletAccount {
    #private;
    get address(): string;
    get publicKey(): Uint8Array<ArrayBuffer>;
    get chains(): readonly ["xrpl:0"];
    get features(): readonly ["xrpl:signTransaction", "xrpl:signAndSubmitTransaction"];
    constructor(address: string);
}
