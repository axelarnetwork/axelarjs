import type { WalletAccount } from '@wallet-standard/core'
import type { BaseTransaction, SubmittableTransaction } from 'xrpl'
import type { XRPLIdentifierString } from '../networks'

export type PrepearedTransaction = SubmittableTransaction | BaseTransaction

export type XRPLSignTransactionVersion = '1.0.0'

export type XRPLSignTransactionFeature = {
  'xrpl:signTransaction': {
    version: XRPLSignTransactionVersion
    signTransaction: XRPLSignTransactionMethod
  }
}

export type XRPLSignTransactionMethod = (input: XRPLSignTransactionInput) => Promise<SignTransactionOutput>

export interface XRPLSignTransactionInput {
  tx_json: PrepearedTransaction
  account: WalletAccount
  network: XRPLIdentifierString
  options?: SignTransactionOption
}

export interface SignTransactionOutput {
  signed_tx_blob: string
}

export interface SignTransactionOption {
  autofill?: boolean
  multisig?: boolean
}
