import type { Transaction as XahauTransaction } from '@transia/xrpl'
import type { WalletAccount } from '@wallet-standard/core'
import type { BaseTransaction, SubmittableTransaction, TxV1Response, Transaction as XRPLTransaction } from 'xrpl'
import type { XRPLIdentifierString } from '../networks'

type PrepearedTransaction = SubmittableTransaction | BaseTransaction

export type XRPLSignAndSubmitTransactionVersion = '1.0.0'

export type XRPLSignAndSubmitTransactionFeature = {
  'xrpl:signAndSubmitTransaction': {
    version: XRPLSignAndSubmitTransactionVersion
    signAndSubmitTransaction: XRPLSignAndSubmitTransactionMethod
  }
}

export type XRPLSignAndSubmitTransactionMethod = (
  input: XRPLSignAndSubmitTransactionInput,
) => Promise<SignAndSubmitTransactionOutput>

export interface XRPLSignAndSubmitTransactionInput {
  tx_json: PrepearedTransaction
  account: WalletAccount
  network: XRPLIdentifierString
  options?: SignAndSubmitTransactionOption
}

export interface SignAndSubmitTransactionOutput {
  tx_hash: string
  tx_json: TxV1Response<XRPLTransaction | XahauTransaction>['result']
}

export interface SignAndSubmitTransactionOption {
  autofill?: boolean
  multisig?: boolean
}
