"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _WalletConnectWallet_instances, _WalletConnectWallet_name, _WalletConnectWallet_icon, _WalletConnectWallet_accounts, _WalletConnectWallet_provider, _WalletConnectWallet_modal, _WalletConnectWallet_session, _WalletConnectWallet_chains, _WalletConnectWallet_listeners, _WalletConnectWallet_connect, _WalletConnectWallet_disconnect, _WalletConnectWallet_signTransaction, _WalletConnectWallet_signAndSubmitTransaction, _WalletConnectWallet_on, _WalletConnectWallet_emit, _WalletConnectWallet_off, _WalletConnectWallet_onSessionConnected, _WalletConnectWallet_onSessionDisonnected;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectWallet = exports.DEFAULT_XRPL_METHODS = void 0;
const modal_1 = require("@walletconnect/modal");
const universal_provider_1 = __importDefault(require("@walletconnect/universal-provider"));
const utils_1 = require("@walletconnect/utils");
const base_1 = require("./base/");
const networks_1 = require("./core/networks");
var DEFAULT_XRPL_METHODS;
(function (DEFAULT_XRPL_METHODS) {
    DEFAULT_XRPL_METHODS["XRPL_SIGN_TRANSACTION"] = "xrpl_signTransaction";
    DEFAULT_XRPL_METHODS["XRPL_SIGN_TRANSACTION_FOR"] = "xrpl_signTransactionFor";
})(DEFAULT_XRPL_METHODS || (exports.DEFAULT_XRPL_METHODS = DEFAULT_XRPL_METHODS = {}));
class WalletConnectWallet {
    get version() {
        return '1.0.0';
    }
    get name() {
        return __classPrivateFieldGet(this, _WalletConnectWallet_name, "f");
    }
    get icon() {
        return __classPrivateFieldGet(this, _WalletConnectWallet_icon, "f");
    }
    get chains() {
        return __classPrivateFieldGet(this, _WalletConnectWallet_chains, "f");
    }
    get features() {
        return {
            'standard:connect': {
                version: '1.0.0',
                connect: __classPrivateFieldGet(this, _WalletConnectWallet_connect, "f"),
            },
            'standard:disconnect': {
                version: '1.0.0',
                disconnect: __classPrivateFieldGet(this, _WalletConnectWallet_disconnect, "f"),
            },
            'standard:events': {
                version: '1.0.0',
                on: __classPrivateFieldGet(this, _WalletConnectWallet_on, "f"),
            },
            'xrpl:signTransaction': {
                version: '1.0.0',
                signTransaction: __classPrivateFieldGet(this, _WalletConnectWallet_signTransaction, "f"),
            },
            'xrpl:signAndSubmitTransaction': {
                version: '1.0.0',
                signAndSubmitTransaction: __classPrivateFieldGet(this, _WalletConnectWallet_signAndSubmitTransaction, "f"),
            },
        };
    }
    get accounts() {
        return __classPrivateFieldGet(this, _WalletConnectWallet_accounts, "f");
    }
    constructor({ projectId, metadata, networks, desktopWallets, mobileWallets }) {
        _WalletConnectWallet_instances.add(this);
        _WalletConnectWallet_name.set(this, 'WalletConnect');
        _WalletConnectWallet_icon.set(this, 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjAlIiBjeT0iNTAlIiByPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1ZDlkZjYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDZmZmYiLz48L3JhZGlhbEdyYWRpZW50PjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0ibTI1NiAwYzE0MS4zODQ4OTYgMCAyNTYgMTE0LjYxNTEwNCAyNTYgMjU2cy0xMTQuNjE1MTA0IDI1Ni0yNTYgMjU2LTI1Ni0xMTQuNjE1MTA0LTI1Ni0yNTYgMTE0LjYxNTEwNC0yNTYgMjU2LTI1NnoiIGZpbGw9InVybCgjYSkiLz48cGF0aCBkPSJtNjQuNjkxNzU1OCAzNy43MDg4Mjk4YzUxLjUzMjgwNzItNTAuMjc4NDM5NyAxMzUuMDgzOTk0Mi01MC4yNzg0Mzk3IDE4Ni42MTY3OTkyIDBsNi4yMDIwNTcgNi4wNTEwOTA2YzIuNTc2NjQgMi41MTM5MjE4IDIuNTc2NjQgNi41ODk3OTQ4IDAgOS4xMDM3MTc3bC0yMS4yMTU5OTggMjAuNjk5NTc1OWMtMS4yODgzMjEgMS4yNTY5NjE5LTMuMzc3MSAxLjI1Njk2MTktNC42NjU0MjEgMGwtOC41MzQ3NjYtOC4zMjcwMjA1Yy0zNS45NTA1NzMtMzUuMDc1NDk2Mi05NC4yMzc5NjktMzUuMDc1NDk2Mi0xMzAuMTg4NTQ0IDBsLTkuMTQwMDI4MiA4LjkxNzU1MTljLTEuMjg4MzIxNyAxLjI1Njk2MDktMy4zNzcxMDE2IDEuMjU2OTYwOS00LjY2NTQyMDggMGwtMjEuMjE1OTk3My0yMC42OTk1NzU5Yy0yLjU3NjY0MDMtMi41MTM5MjI5LTIuNTc2NjQwMy02LjU4OTc5NTggMC05LjEwMzcxNzd6bTIzMC40OTM0ODUyIDQyLjgwODkxMTcgMTguODgyMjc5IDE4LjQyMjcyNjJjMi41NzY2MjcgMi41MTM5MTAzIDIuNTc2NjQyIDYuNTg5NzU5My4wMDAwMzIgOS4xMDM2ODYzbC04NS4xNDE0OTggODMuMDcwMzU4Yy0yLjU3NjYyMyAyLjUxMzk0MS02Ljc1NDE4MiAyLjUxMzk2OS05LjMzMDg0LjAwMDA2Ni0uMDAwMDEtLjAwMDAxLS4wMDAwMjMtLjAwMDAyMy0uMDAwMDMzLS4wMDAwMzRsLTYwLjQyODI1Ni01OC45NTc0NTFjLS42NDQxNi0uNjI4NDgxLTEuNjg4NTUtLjYyODQ4MS0yLjMzMjcxIDAtLjAwMDAwNC4wMDAwMDQtLjAwMDAwOC4wMDAwMDctLjAwMDAxMi4wMDAwMTFsLTYwLjQyNjk2ODMgNTguOTU3NDA4Yy0yLjU3NjYxNDEgMi41MTM5NDctNi43NTQxNzQ2IDIuNTEzOTktOS4zMzA4NDA4LjAwMDA5Mi0uMDAwMDE1MS0uMDAwMDE0LS4wMDAwMzA5LS4wMDAwMjktLjAwMDA0NjctLjAwMDA0NmwtODUuMTQzODY3NzQtODMuMDcxNDYzYy0yLjU3NjYzOTI4LTIuNTEzOTIxLTIuNTc2NjM5MjgtNi41ODk3OTUgMC05LjEwMzcxNjNsMTguODgyMzEyNjQtMTguNDIyNjk1NWMyLjU3NjYzOTMtMi41MTM5MjIyIDYuNzU0MTk5My0yLjUxMzkyMjIgOS4zMzA4Mzk3IDBsNjAuNDI5MTM0NyA1OC45NTgyNzU4Yy42NDQxNjA4LjYyODQ4IDEuNjg4NTQ5NS42Mjg0OCAyLjMzMjcxMDMgMCAuMDAwMDA5NS0uMDAwMDA5LjAwMDAxODItLjAwMDAxOC4wMDAwMjc3LS4wMDAwMjVsNjAuNDI2MTA2NS01OC45NTgyNTA4YzIuNTc2NTgxLTIuNTEzOTggNi43NTQxNDItMi41MTQwNzQzIDkuMzMwODQtLjAwMDIxMDMuMDAwMDM3LjAwMDAzNTQuMDAwMDcyLjAwMDA3MDkuMDAwMTA3LjAwMDEwNjNsNjAuNDI5MDU2IDU4Ljk1ODM1NDhjLjY0NDE1OS42Mjg0NzkgMS42ODg1NDkuNjI4NDc5IDIuMzMyNzA5IDBsNjAuNDI4MDc5LTU4Ljk1NzE5MjVjMi41NzY2NC0yLjUxMzkyMzEgNi43NTQxOTktMi41MTM5MjMxIDkuMzMwODM5IDB6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk4IDE2MCkiLz48L2c+PC9zdmc+');
        _WalletConnectWallet_accounts.set(this, []);
        _WalletConnectWallet_provider.set(this, void 0);
        _WalletConnectWallet_modal.set(this, void 0);
        _WalletConnectWallet_session.set(this, null);
        _WalletConnectWallet_chains.set(this, void 0);
        _WalletConnectWallet_listeners.set(this, {});
        _WalletConnectWallet_connect.set(this, async ({ silent = false } = {}) => {
            if (silent) {
                const sessions = __classPrivateFieldGet(this, _WalletConnectWallet_provider, "f").client.session.getAll();
                if (sessions.length === 0) {
                    __classPrivateFieldGet(this, _WalletConnectWallet_onSessionDisonnected, "f").call(this);
                    return { accounts: __classPrivateFieldGet(this, _WalletConnectWallet_accounts, "f") };
                }
                const lastKeyIndex = sessions.length - 1;
                const lastSession = sessions[lastKeyIndex];
                __classPrivateFieldGet(this, _WalletConnectWallet_onSessionConnected, "f").call(this, lastSession);
                return { accounts: __classPrivateFieldGet(this, _WalletConnectWallet_accounts, "f") };
            }
            const { uri, approval } = await __classPrivateFieldGet(this, _WalletConnectWallet_provider, "f").client.connect({
                requiredNamespaces: {
                    xrpl: {
                        methods: [DEFAULT_XRPL_METHODS.XRPL_SIGN_TRANSACTION],
                        chains: __classPrivateFieldGet(this, _WalletConnectWallet_chains, "f"),
                        events: ['chainChanged', 'accountsChanged'],
                    },
                },
                sessionProperties: {},
            });
            let unsubscribe = () => { };
            if (uri) {
                __classPrivateFieldGet(this, _WalletConnectWallet_modal, "f").openModal({ uri });
                unsubscribe = __classPrivateFieldGet(this, _WalletConnectWallet_modal, "f").subscribeModal((state) => {
                    if (state.open === false)
                        throw new Error('User closed the modal');
                });
            }
            const session = await approval();
            __classPrivateFieldSet(this, _WalletConnectWallet_session, session, "f");
            __classPrivateFieldGet(this, _WalletConnectWallet_onSessionConnected, "f").call(this, session);
            unsubscribe();
            __classPrivateFieldGet(this, _WalletConnectWallet_modal, "f").closeModal();
            return { accounts: this.accounts };
        });
        _WalletConnectWallet_disconnect.set(this, async () => {
            if (!__classPrivateFieldGet(this, _WalletConnectWallet_session, "f"))
                throw new Error('Session is not connected');
            __classPrivateFieldGet(this, _WalletConnectWallet_provider, "f").client.disconnect({
                topic: __classPrivateFieldGet(this, _WalletConnectWallet_session, "f").topic,
                reason: (0, utils_1.getSdkError)('USER_DISCONNECTED'),
            });
        });
        _WalletConnectWallet_signTransaction.set(this, async ({ tx_json, account, network, options }) => {
            if (!__classPrivateFieldGet(this, _WalletConnectWallet_session, "f"))
                throw new Error('Session is not connected');
            const result = await __classPrivateFieldGet(this, _WalletConnectWallet_provider, "f").client.request({
                chainId: network,
                topic: __classPrivateFieldGet(this, _WalletConnectWallet_session, "f").topic,
                request: {
                    method: DEFAULT_XRPL_METHODS.XRPL_SIGN_TRANSACTION,
                    params: {
                        tx_json: tx_json,
                        autofill: options === null || options === void 0 ? void 0 : options.autofill,
                        submit: false,
                    },
                },
            });
            const hash = result.tx_json.hash;
            // TODO: Implement encode method for any network by using the network parameter(Netowrk ID)
            // const signed_tx_blob = encode(result.tx_json)
            throw new Error('encode functionality is not implemented');
            // const signed_tx_blob = ''
            // return { signed_tx_blob, hash }
        });
        _WalletConnectWallet_signAndSubmitTransaction.set(this, async ({ tx_json, account, network, options }) => {
            if (!__classPrivateFieldGet(this, _WalletConnectWallet_session, "f"))
                throw new Error('Session is not connected');
            const result = await __classPrivateFieldGet(this, _WalletConnectWallet_provider, "f").client.request({
                chainId: network,
                topic: __classPrivateFieldGet(this, _WalletConnectWallet_session, "f").topic,
                request: {
                    method: DEFAULT_XRPL_METHODS.XRPL_SIGN_TRANSACTION,
                    params: {
                        tx_json: tx_json,
                        autofill: options === null || options === void 0 ? void 0 : options.autofill,
                        submit: true,
                    },
                },
            });
            return { tx_json: result.tx_json, tx_hash: result.tx_json.hash };
        });
        _WalletConnectWallet_on.set(this, (event, listener) => {
            var _a;
            if (__classPrivateFieldGet(this, _WalletConnectWallet_listeners, "f")[event])
                (_a = __classPrivateFieldGet(this, _WalletConnectWallet_listeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.push(listener);
            else
                __classPrivateFieldGet(this, _WalletConnectWallet_listeners, "f")[event] = [listener];
            return () => __classPrivateFieldGet(this, _WalletConnectWallet_instances, "m", _WalletConnectWallet_off).call(this, event, listener);
        });
        _WalletConnectWallet_onSessionConnected.set(this, async (_session) => {
            const allNamespaceAccounts = Object.values(_session.namespaces).flatMap((namespace) => namespace.accounts);
            const allNamespaceChains = Object.keys(_session.namespaces).flatMap((ns) => _session.namespaces[ns].chains || []);
            __classPrivateFieldSet(this, _WalletConnectWallet_session, _session, "f");
            __classPrivateFieldSet(this, _WalletConnectWallet_accounts, [
                ...new Set(allNamespaceAccounts.map((address) => new base_1.XRPLWalletAccount(address.split(':').at(-1)))),
            ], "f");
            __classPrivateFieldGet(this, _WalletConnectWallet_instances, "m", _WalletConnectWallet_emit).call(this, 'change', { accounts: this.accounts });
        });
        _WalletConnectWallet_onSessionDisonnected.set(this, async () => {
            __classPrivateFieldSet(this, _WalletConnectWallet_session, null, "f");
            __classPrivateFieldSet(this, _WalletConnectWallet_accounts, [], "f");
            __classPrivateFieldGet(this, _WalletConnectWallet_instances, "m", _WalletConnectWallet_emit).call(this, 'change', { accounts: __classPrivateFieldGet(this, _WalletConnectWallet_accounts, "f") });
        });
        universal_provider_1.default.init({
            // logger: "info",
            projectId,
            metadata,
            client: undefined, // optional instance of @walletconnect/sign-client
        }).then((provider) => {
            __classPrivateFieldSet(this, _WalletConnectWallet_provider, provider, "f");
            __classPrivateFieldGet(this, _WalletConnectWallet_provider, "f").client.on('session_update', ({ topic, params }) => {
                console.debug('EVENT', 'session_update', { topic, params });
                const { namespaces } = params;
                const _session = __classPrivateFieldGet(this, _WalletConnectWallet_provider, "f").client.session.get(topic);
                const updatedSession = { ..._session, namespaces };
                __classPrivateFieldGet(this, _WalletConnectWallet_onSessionConnected, "f").call(this, updatedSession);
            });
            __classPrivateFieldGet(this, _WalletConnectWallet_provider, "f").client.on('session_delete', () => {
                console.debug('EVENT', 'session_delete');
                __classPrivateFieldGet(this, _WalletConnectWallet_onSessionDisonnected, "f").call(this);
            });
        });
        __classPrivateFieldSet(this, _WalletConnectWallet_chains, networks.map((network) => (0, networks_1.convertNetworkToChainId)(network)), "f");
        __classPrivateFieldSet(this, _WalletConnectWallet_modal, new modal_1.WalletConnectModal({
            projectId,
            chains: __classPrivateFieldGet(this, _WalletConnectWallet_chains, "f"),
            explorerExcludedWalletIds: 'ALL',
            desktopWallets,
            mobileWallets,
        }), "f");
        if (new.target === WalletConnectWallet) {
            Object.freeze(this);
        }
    }
}
exports.WalletConnectWallet = WalletConnectWallet;
_WalletConnectWallet_name = new WeakMap(), _WalletConnectWallet_icon = new WeakMap(), _WalletConnectWallet_accounts = new WeakMap(), _WalletConnectWallet_provider = new WeakMap(), _WalletConnectWallet_modal = new WeakMap(), _WalletConnectWallet_session = new WeakMap(), _WalletConnectWallet_chains = new WeakMap(), _WalletConnectWallet_listeners = new WeakMap(), _WalletConnectWallet_connect = new WeakMap(), _WalletConnectWallet_disconnect = new WeakMap(), _WalletConnectWallet_signTransaction = new WeakMap(), _WalletConnectWallet_signAndSubmitTransaction = new WeakMap(), _WalletConnectWallet_on = new WeakMap(), _WalletConnectWallet_onSessionConnected = new WeakMap(), _WalletConnectWallet_onSessionDisonnected = new WeakMap(), _WalletConnectWallet_instances = new WeakSet(), _WalletConnectWallet_emit = function _WalletConnectWallet_emit(event, ...args) {
    var _a;
    (_a = __classPrivateFieldGet(this, _WalletConnectWallet_listeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener.apply(null, args));
}, _WalletConnectWallet_off = function _WalletConnectWallet_off(event, listener) {
    var _a;
    __classPrivateFieldGet(this, _WalletConnectWallet_listeners, "f")[event] = (_a = __classPrivateFieldGet(this, _WalletConnectWallet_listeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.filter((existingListener) => listener !== existingListener);
};
