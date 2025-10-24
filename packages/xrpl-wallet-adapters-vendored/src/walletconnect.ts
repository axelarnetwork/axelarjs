import { WalletConnectModal } from '@walletconnect/modal'
import type { WalletConnectModalConfig } from '@walletconnect/modal'
import type { SessionTypes } from '@walletconnect/types'
import UniversalProvider from '@walletconnect/universal-provider'
import { getSdkError } from '@walletconnect/utils'
import { type XRPLBaseWallet, XRPLWalletAccount } from './base/'
import type {
  StandardConnectFeature,
  StandardConnectMethod,
  StandardDisconnectFeature,
  StandardDisconnectMethod,
  StandardEventsFeature,
  StandardEventsListeners,
  StandardEventsNames,
  StandardEventsOnMethod,
  XRPLIdentifierString,
  XRPLSignAndSubmitTransactionFeature,
  XRPLSignAndSubmitTransactionMethod,
  XRPLSignTransactionFeature,
  XRPLSignTransactionMethod,
} from './core'
import { convertNetworkToChainId } from './core/networks'

export enum DEFAULT_XRPL_METHODS {
  XRPL_SIGN_TRANSACTION = 'xrpl_signTransaction',
  XRPL_SIGN_TRANSACTION_FOR = 'xrpl_signTransactionFor',
}

interface WalletConnectWalletProps {
  projectId: string
  metadata?: {
    name: string
    description: string
    url: string
    icons: string[]
  }
  networks: XRPLIdentifierString[]
  desktopWallets: WalletConnectModalConfig['desktopWallets']
  mobileWallets: WalletConnectModalConfig['mobileWallets']
}

export class WalletConnectWallet implements XRPLBaseWallet {
  #name = 'WalletConnect'
  #icon =
    'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjAlIiBjeT0iNTAlIiByPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1ZDlkZjYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDZmZmYiLz48L3JhZGlhbEdyYWRpZW50PjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0ibTI1NiAwYzE0MS4zODQ4OTYgMCAyNTYgMTE0LjYxNTEwNCAyNTYgMjU2cy0xMTQuNjE1MTA0IDI1Ni0yNTYgMjU2LTI1Ni0xMTQuNjE1MTA0LTI1Ni0yNTYgMTE0LjYxNTEwNC0yNTYgMjU2LTI1NnoiIGZpbGw9InVybCgjYSkiLz48cGF0aCBkPSJtNjQuNjkxNzU1OCAzNy43MDg4Mjk4YzUxLjUzMjgwNzItNTAuMjc4NDM5NyAxMzUuMDgzOTk0Mi01MC4yNzg0Mzk3IDE4Ni42MTY3OTkyIDBsNi4yMDIwNTcgNi4wNTEwOTA2YzIuNTc2NjQgMi41MTM5MjE4IDIuNTc2NjQgNi41ODk3OTQ4IDAgOS4xMDM3MTc3bC0yMS4yMTU5OTggMjAuNjk5NTc1OWMtMS4yODgzMjEgMS4yNTY5NjE5LTMuMzc3MSAxLjI1Njk2MTktNC42NjU0MjEgMGwtOC41MzQ3NjYtOC4zMjcwMjA1Yy0zNS45NTA1NzMtMzUuMDc1NDk2Mi05NC4yMzc5NjktMzUuMDc1NDk2Mi0xMzAuMTg4NTQ0IDBsLTkuMTQwMDI4MiA4LjkxNzU1MTljLTEuMjg4MzIxNyAxLjI1Njk2MDktMy4zNzcxMDE2IDEuMjU2OTYwOS00LjY2NTQyMDggMGwtMjEuMjE1OTk3My0yMC42OTk1NzU5Yy0yLjU3NjY0MDMtMi41MTM5MjI5LTIuNTc2NjQwMy02LjU4OTc5NTggMC05LjEwMzcxNzd6bTIzMC40OTM0ODUyIDQyLjgwODkxMTcgMTguODgyMjc5IDE4LjQyMjcyNjJjMi41NzY2MjcgMi41MTM5MTAzIDIuNTc2NjQyIDYuNTg5NzU5My4wMDAwMzIgOS4xMDM2ODYzbC04NS4xNDE0OTggODMuMDcwMzU4Yy0yLjU3NjYyMyAyLjUxMzk0MS02Ljc1NDE4MiAyLjUxMzk2OS05LjMzMDg0LjAwMDA2Ni0uMDAwMDEtLjAwMDAxLS4wMDAwMjMtLjAwMDAyMy0uMDAwMDMzLS4wMDAwMzRsLTYwLjQyODI1Ni01OC45NTc0NTFjLS42NDQxNi0uNjI4NDgxLTEuNjg4NTUtLjYyODQ4MS0yLjMzMjcxIDAtLjAwMDAwNC4wMDAwMDQtLjAwMDAwOC4wMDAwMDctLjAwMDAxMi4wMDAwMTFsLTYwLjQyNjk2ODMgNTguOTU3NDA4Yy0yLjU3NjYxNDEgMi41MTM5NDctNi43NTQxNzQ2IDIuNTEzOTktOS4zMzA4NDA4LjAwMDA5Mi0uMDAwMDE1MS0uMDAwMDE0LS4wMDAwMzA5LS4wMDAwMjktLjAwMDA0NjctLjAwMDA0NmwtODUuMTQzODY3NzQtODMuMDcxNDYzYy0yLjU3NjYzOTI4LTIuNTEzOTIxLTIuNTc2NjM5MjgtNi41ODk3OTUgMC05LjEwMzcxNjNsMTguODgyMzEyNjQtMTguNDIyNjk1NWMyLjU3NjYzOTMtMi41MTM5MjIyIDYuNzU0MTk5My0yLjUxMzkyMjIgOS4zMzA4Mzk3IDBsNjAuNDI5MTM0NyA1OC45NTgyNzU4Yy42NDQxNjA4LjYyODQ4IDEuNjg4NTQ5NS42Mjg0OCAyLjMzMjcxMDMgMCAuMDAwMDA5NS0uMDAwMDA5LjAwMDAxODItLjAwMDAxOC4wMDAwMjc3LS4wMDAwMjVsNjAuNDI2MTA2NS01OC45NTgyNTA4YzIuNTc2NTgxLTIuNTEzOTggNi43NTQxNDItMi41MTQwNzQzIDkuMzMwODQtLjAwMDIxMDMuMDAwMDM3LjAwMDAzNTQuMDAwMDcyLjAwMDA3MDkuMDAwMTA3LjAwMDEwNjNsNjAuNDI5MDU2IDU4Ljk1ODM1NDhjLjY0NDE1OS42Mjg0NzkgMS42ODg1NDkuNjI4NDc5IDIuMzMyNzA5IDBsNjAuNDI4MDc5LTU4Ljk1NzE5MjVjMi41NzY2NC0yLjUxMzkyMzEgNi43NTQxOTktMi41MTM5MjMxIDkuMzMwODM5IDB6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk4IDE2MCkiLz48L2c+PC9zdmc+' as const

  #accounts: XRPLWalletAccount[] = []
  #provider: UniversalProvider
  #modal: WalletConnectModal

  #session: SessionTypes.Struct | null = null

  #chains: XRPLIdentifierString[]

  readonly #listeners: { [E in StandardEventsNames]?: StandardEventsListeners[E][] } = {}

  get version() {
    return '1.0.0' as const
  }

  get name() {
    return this.#name
  }

  get icon() {
    return this.#icon
  }

  get chains() {
    return this.#chains
  }

  get features(): StandardConnectFeature &
    StandardEventsFeature &
    StandardDisconnectFeature &
    XRPLSignTransactionFeature &
    XRPLSignAndSubmitTransactionFeature {
    return {
      'standard:connect': {
        version: '1.0.0',
        connect: this.#connect,
      },
      'standard:disconnect': {
        version: '1.0.0',
        disconnect: this.#disconnect,
      },
      'standard:events': {
        version: '1.0.0',
        on: this.#on,
      },
      'xrpl:signTransaction': {
        version: '1.0.0',
        signTransaction: this.#signTransaction,
      },
      'xrpl:signAndSubmitTransaction': {
        version: '1.0.0',
        signAndSubmitTransaction: this.#signAndSubmitTransaction,
      },
    }
  }

  get accounts() {
    return this.#accounts
  }

  constructor({ projectId, metadata, networks, desktopWallets, mobileWallets }: WalletConnectWalletProps) {
    UniversalProvider.init({
      // logger: "info",
      projectId,
      metadata,
      client: undefined, // optional instance of @walletconnect/sign-client
    }).then((provider) => {
      this.#provider = provider
      this.#provider.client.on('session_update', ({ topic, params }) => {
        console.debug('EVENT', 'session_update', { topic, params })
        const { namespaces } = params
        const _session = this.#provider.client.session.get(topic)
        const updatedSession = { ..._session, namespaces }
        this.#onSessionConnected(updatedSession)
      })
      this.#provider.client.on('session_delete', () => {
        console.debug('EVENT', 'session_delete')
        this.#onSessionDisonnected()
      })
    })
    this.#chains = networks.map((network) => convertNetworkToChainId(network))
    this.#modal = new WalletConnectModal({
      projectId,
      chains: this.#chains,
      explorerExcludedWalletIds: 'ALL',
      desktopWallets,
      mobileWallets,
    })

    if (new.target === WalletConnectWallet) {
      Object.freeze(this)
    }
  }

  #connect: StandardConnectMethod = async ({ silent = false } = {}) => {
    if (silent) {
      const sessions = this.#provider.client.session.getAll()
      if (sessions.length === 0) {
        this.#onSessionDisonnected()
        return { accounts: this.#accounts }
      }
      const lastKeyIndex = sessions.length - 1
      const lastSession = sessions[lastKeyIndex]
      this.#onSessionConnected(lastSession)
      return { accounts: this.#accounts }
    }

    const { uri, approval } = await this.#provider.client.connect({
      requiredNamespaces: {
        xrpl: {
          methods: [DEFAULT_XRPL_METHODS.XRPL_SIGN_TRANSACTION],
          chains: this.#chains,
          events: ['chainChanged', 'accountsChanged'],
        },
      },
      sessionProperties: {},
    })

    let unsubscribe = () => {}
    if (uri) {
      this.#modal.openModal({ uri })
      unsubscribe = this.#modal.subscribeModal((state) => {
        if (state.open === false) throw new Error('User closed the modal')
      })
    }
    const session = await approval()
    this.#session = session
    this.#onSessionConnected(session)
    unsubscribe()
    this.#modal.closeModal()

    return { accounts: this.accounts }
  }

  #disconnect: StandardDisconnectMethod = async () => {
    if (!this.#session) throw new Error('Session is not connected')
    this.#provider.client.disconnect({
      topic: this.#session.topic,
      reason: getSdkError('USER_DISCONNECTED'),
    })
  }

  #signTransaction: XRPLSignTransactionMethod = async ({ tx_json, account, network, options }) => {
    if (!this.#session) throw new Error('Session is not connected')
    const result = await this.#provider.client.request<{ tx_json: Record<string, any> }>({
      chainId: network,
      topic: this.#session.topic,
      request: {
        method: DEFAULT_XRPL_METHODS.XRPL_SIGN_TRANSACTION,
        params: {
          tx_json: tx_json,
          autofill: options?.autofill,
          submit: false,
        },
      },
    })
    const hash = result.tx_json.hash
    // TODO: Implement encode method for any network by using the network parameter(Netowrk ID)
    // const signed_tx_blob = encode(result.tx_json)
    throw new Error('encode functionality is not implemented')
    // const signed_tx_blob = ''
    // return { signed_tx_blob, hash }
  }

  #signAndSubmitTransaction: XRPLSignAndSubmitTransactionMethod = async ({ tx_json, account, network, options }) => {
    if (!this.#session) throw new Error('Session is not connected')
    const result = await this.#provider.client.request<{ tx_json: Record<string, any> }>({
      chainId: network,
      topic: this.#session.topic,
      request: {
        method: DEFAULT_XRPL_METHODS.XRPL_SIGN_TRANSACTION,
        params: {
          tx_json: tx_json,
          autofill: options?.autofill,
          submit: true,
        },
      },
    })
    return { tx_json: result.tx_json as any, tx_hash: result.tx_json.hash }
  }

  #on: StandardEventsOnMethod = (event, listener) => {
    if (this.#listeners[event]) this.#listeners[event]?.push(listener)
    else this.#listeners[event] = [listener]
    return (): void => this.#off(event, listener)
  }

  #emit<E extends StandardEventsNames>(event: E, ...args: Parameters<StandardEventsListeners[E]>): void {
    this.#listeners[event]?.forEach((listener) => listener.apply(null, args))
  }

  #off<E extends StandardEventsNames>(event: E, listener: StandardEventsListeners[E]): void {
    this.#listeners[event] = this.#listeners[event]?.filter((existingListener) => listener !== existingListener)
  }

  #onSessionConnected = async (_session: SessionTypes.Struct) => {
    const allNamespaceAccounts = Object.values(_session.namespaces).flatMap((namespace) => namespace.accounts)
    const allNamespaceChains = Object.keys(_session.namespaces).flatMap((ns) => _session.namespaces[ns].chains || [])

    this.#session = _session
    this.#accounts = [
      ...new Set(allNamespaceAccounts.map((address) => new XRPLWalletAccount(address.split(':').at(-1)!))),
    ]

    this.#emit('change', { accounts: this.accounts })
  }

  #onSessionDisonnected = async () => {
    this.#session = null
    this.#accounts = []
    this.#emit('change', { accounts: this.#accounts })
  }
}
