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
var _MetaMaskWallet_instances, _MetaMaskWallet_name, _MetaMaskWallet_icon, _MetaMaskWallet_accounts, _MetaMaskWallet_listeners, _MetaMaskWallet_provider_get, _MetaMaskWallet_invokeSnapRequest, _MetaMaskWallet_changeNetworkHandler, _MetaMaskWallet_signTransactionHandler, _MetaMaskWallet_signAndSubmitTransactionHandler, _MetaMaskWallet_connect, _MetaMaskWallet_signTransaction, _MetaMaskWallet_signAndSubmitTransaction, _MetaMaskWallet_on, _MetaMaskWallet_emit, _MetaMaskWallet_off, _MetaMaskWallet_convertNetworkToId;
import { XRPLWalletAccount } from './base';
import { XRPL_DEVNET, XRPL_MAINNET, XRPL_TESTNET, } from './core';
export const SNAP_ORIGIN = 'npm:xrpl-snap';
export class MetaMaskWallet {
    constructor() {
        _MetaMaskWallet_instances.add(this);
        _MetaMaskWallet_name.set(this, 'MetaMask');
        _MetaMaskWallet_icon.set(this, 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIGlkPSJMYXllcl8xIiB4PSIwIiB5PSIwIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMTguNiAzMTguNiI+CiAgPHN0eWxlPgogICAgLnN0MSwuc3Q2e2ZpbGw6I2U0NzYxYjtzdHJva2U6I2U0NzYxYjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmR9LnN0NntmaWxsOiNmNjg1MWI7c3Ryb2tlOiNmNjg1MWJ9CiAgPC9zdHlsZT4KICA8cGF0aCBmaWxsPSIjZTI3NjFiIiBzdHJva2U9IiNlMjc2MWIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0ibTI3NC4xIDM1LjUtOTkuNSA3My45TDE5MyA2NS44eiIvPgogIDxwYXRoIGQ9Im00NC40IDM1LjUgOTguNyA3NC42LTE3LjUtNDQuM3ptMTkzLjkgMTcxLjMtMjYuNSA0MC42IDU2LjcgMTUuNiAxNi4zLTU1LjN6bS0yMDQuNC45TDUwLjEgMjYzbDU2LjctMTUuNi0yNi41LTQwLjZ6IiBjbGFzcz0ic3QxIi8+CiAgPHBhdGggZD0ibTEwMy42IDEzOC4yLTE1LjggMjMuOSA1Ni4zIDIuNS0yLTYwLjV6bTExMS4zIDAtMzktMzQuOC0xLjMgNjEuMiA1Ni4yLTIuNXpNMTA2LjggMjQ3LjRsMzMuOC0xNi41LTI5LjItMjIuOHptNzEuMS0xNi41IDMzLjkgMTYuNS00LjctMzkuM3oiIGNsYXNzPSJzdDEiLz4KICA8cGF0aCBmaWxsPSIjZDdjMWIzIiBzdHJva2U9IiNkN2MxYjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0ibTIxMS44IDI0Ny40LTMzLjktMTYuNSAyLjcgMjIuMS0uMyA5LjN6bS0xMDUgMCAzMS41IDE0LjktLjItOS4zIDIuNS0yMi4xeiIvPgogIDxwYXRoIGZpbGw9IiMyMzM0NDciIHN0cm9rZT0iIzIzMzQ0NyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJtMTM4LjggMTkzLjUtMjguMi04LjMgMTkuOS05LjF6bTQwLjkgMCA4LjMtMTcuNCAyMCA5LjF6Ii8+CiAgPHBhdGggZmlsbD0iI2NkNjExNiIgc3Ryb2tlPSIjY2Q2MTE2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Im0xMDYuOCAyNDcuNCA0LjgtNDAuNi0zMS4zLjl6TTIwNyAyMDYuOGw0LjggNDAuNiAyNi41LTM5Ljd6bTIzLjgtNDQuNy01Ni4yIDIuNSA1LjIgMjguOSA4LjMtMTcuNCAyMCA5LjF6bS0xMjAuMiAyMy4xIDIwLTkuMSA4LjIgMTcuNCA1LjMtMjguOS01Ni4zLTIuNXoiLz4KICA8cGF0aCBmaWxsPSIjZTQ3NTFmIiBzdHJva2U9IiNlNDc1MWYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0ibTg3LjggMTYyLjEgMjMuNiA0Ni0uOC0yMi45em0xMjAuMyAyMy4xLTEgMjIuOSAyMy43LTQ2em0tNjQtMjAuNi01LjMgMjguOSA2LjYgMzQuMSAxLjUtNDQuOXptMzAuNSAwLTIuNyAxOCAxLjIgNDUgNi43LTM0LjF6Ii8+CiAgPHBhdGggZD0ibTE3OS44IDE5My41LTYuNyAzNC4xIDQuOCAzLjMgMjkuMi0yMi44IDEtMjIuOXptLTY5LjItOC4zLjggMjIuOSAyOS4yIDIyLjggNC44LTMuMy02LjYtMzQuMXoiIGNsYXNzPSJzdDYiLz4KICA8cGF0aCBmaWxsPSIjYzBhZDllIiBzdHJva2U9IiNjMGFkOWUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0ibTE4MC4zIDI2Mi4zLjMtOS4zLTIuNS0yLjJoLTM3LjdsLTIuMyAyLjIuMiA5LjMtMzEuNS0xNC45IDExIDkgMjIuMyAxNS41aDM4LjNsMjIuNC0xNS41IDExLTl6Ii8+CiAgPHBhdGggZmlsbD0iIzE2MTYxNiIgc3Ryb2tlPSIjMTYxNjE2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Im0xNzcuOSAyMzAuOS00LjgtMy4zaC0yNy43bC00LjggMy4zLTIuNSAyMi4xIDIuMy0yLjJoMzcuN2wyLjUgMi4yeiIvPgogIDxwYXRoIGZpbGw9IiM3NjNkMTYiIHN0cm9rZT0iIzc2M2QxNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJtMjc4LjMgMTE0LjIgOC41LTQwLjgtMTIuNy0zNy45LTk2LjIgNzEuNCAzNyAzMS4zIDUyLjMgMTUuMyAxMS42LTEzLjUtNS0zLjYgOC03LjMtNi4yLTQuOCA4LTYuMXpNMzEuOCA3My40bDguNSA0MC44LTUuNCA0IDggNi4xLTYuMSA0LjggOCA3LjMtNSAzLjYgMTEuNSAxMy41IDUyLjMtMTUuMyAzNy0zMS4zLTk2LjItNzEuNHoiLz4KICA8cGF0aCBkPSJtMjY3LjIgMTUzLjUtNTIuMy0xNS4zIDE1LjkgMjMuOS0yMy43IDQ2IDMxLjItLjRoNDYuNXptLTE2My42LTE1LjMtNTIuMyAxNS4zLTE3LjQgNTQuMmg0Ni40bDMxLjEuNC0yMy42LTQ2em03MSAyNi40IDMuMy01Ny43IDE1LjItNDEuMWgtNjcuNWwxNSA0MS4xIDMuNSA1Ny43IDEuMiAxOC4yLjEgNDQuOGgyNy43bC4yLTQ0Ljh6IiBjbGFzcz0ic3Q2Ii8+Cjwvc3ZnPg==');
        _MetaMaskWallet_accounts.set(this, []);
        _MetaMaskWallet_listeners.set(this, {});
        _MetaMaskWallet_invokeSnapRequest.set(this, async (request) => {
            return await __classPrivateFieldGet(this, _MetaMaskWallet_instances, "a", _MetaMaskWallet_provider_get).request({
                method: 'wallet_invokeSnap',
                params: {
                    snapId: SNAP_ORIGIN,
                    request,
                },
            });
        });
        _MetaMaskWallet_changeNetworkHandler.set(this, async (network) => {
            const currentNetworkInfo = (await __classPrivateFieldGet(this, _MetaMaskWallet_invokeSnapRequest, "f").call(this, {
                method: 'xrpl_getActiveNetwork',
            }));
            const currentNetworkId = currentNetworkInfo.chainId;
            const txNetworkId = Number(network.split(':')[1]);
            if (txNetworkId === currentNetworkId)
                return;
            const networkList = (await __classPrivateFieldGet(this, _MetaMaskWallet_invokeSnapRequest, "f").call(this, {
                method: 'xrpl_getStoredNetworks',
            }));
            const networkInfo = networkList.find((n) => n.chainId === txNetworkId);
            if (!networkInfo)
                throw new Error('Network not found');
            await __classPrivateFieldGet(this, _MetaMaskWallet_invokeSnapRequest, "f").call(this, {
                method: 'xrpl_changeNetwork',
                params: {
                    chainId: networkInfo.chainId,
                },
            });
        });
        _MetaMaskWallet_signTransactionHandler.set(this, async (tx_json) => {
            return (await __classPrivateFieldGet(this, _MetaMaskWallet_invokeSnapRequest, "f").call(this, {
                method: 'xrpl_sign',
                params: tx_json,
            }));
        });
        _MetaMaskWallet_signAndSubmitTransactionHandler.set(this, async (tx_json) => {
            return (await __classPrivateFieldGet(this, _MetaMaskWallet_invokeSnapRequest, "f").call(this, {
                method: 'xrpl_signAndSubmit',
                params: tx_json,
            }));
        });
        _MetaMaskWallet_connect.set(this, async ({ silent = false } = {}) => {
            if (silent) {
                const snaps = (await __classPrivateFieldGet(this, _MetaMaskWallet_instances, "a", _MetaMaskWallet_provider_get).request({
                    method: 'wallet_getSnaps',
                }));
                if (!snaps[SNAP_ORIGIN]) {
                    __classPrivateFieldSet(this, _MetaMaskWallet_accounts, [], "f");
                    __classPrivateFieldGet(this, _MetaMaskWallet_instances, "m", _MetaMaskWallet_emit).call(this, 'change', { accounts: this.accounts });
                    return {
                        accounts: __classPrivateFieldGet(this, _MetaMaskWallet_accounts, "f"),
                    };
                }
            }
            else {
                await __classPrivateFieldGet(this, _MetaMaskWallet_instances, "a", _MetaMaskWallet_provider_get).request({
                    method: 'wallet_requestSnaps',
                    params: {
                        [SNAP_ORIGIN]: {},
                    },
                });
            }
            const snapAccount = (await __classPrivateFieldGet(this, _MetaMaskWallet_invokeSnapRequest, "f").call(this, {
                method: 'xrpl_getAccount',
            }));
            __classPrivateFieldSet(this, _MetaMaskWallet_accounts, [new XRPLWalletAccount(snapAccount.account)], "f");
            __classPrivateFieldGet(this, _MetaMaskWallet_instances, "m", _MetaMaskWallet_emit).call(this, 'change', { accounts: this.accounts });
            return {
                accounts: __classPrivateFieldGet(this, _MetaMaskWallet_accounts, "f"),
            };
        });
        _MetaMaskWallet_signTransaction.set(this, async ({ tx_json, account, network }) => {
            const networkId = __classPrivateFieldGet(this, _MetaMaskWallet_convertNetworkToId, "f").call(this, network);
            await __classPrivateFieldGet(this, _MetaMaskWallet_changeNetworkHandler, "f").call(this, networkId);
            const { tx_blob } = await __classPrivateFieldGet(this, _MetaMaskWallet_signTransactionHandler, "f").call(this, tx_json);
            return {
                signed_tx_blob: tx_blob,
            };
        });
        _MetaMaskWallet_signAndSubmitTransaction.set(this, async ({ tx_json, account, network }) => {
            const networkId = __classPrivateFieldGet(this, _MetaMaskWallet_convertNetworkToId, "f").call(this, network);
            await __classPrivateFieldGet(this, _MetaMaskWallet_changeNetworkHandler, "f").call(this, networkId);
            const txResponse = await __classPrivateFieldGet(this, _MetaMaskWallet_signAndSubmitTransactionHandler, "f").call(this, tx_json);
            return {
                tx_json: txResponse.result.tx_json,
                tx_hash: txResponse.result.tx_json.hash,
            };
        });
        _MetaMaskWallet_on.set(this, (event, listener) => {
            var _a;
            if (__classPrivateFieldGet(this, _MetaMaskWallet_listeners, "f")[event])
                (_a = __classPrivateFieldGet(this, _MetaMaskWallet_listeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.push(listener);
            else
                __classPrivateFieldGet(this, _MetaMaskWallet_listeners, "f")[event] = [listener];
            return () => __classPrivateFieldGet(this, _MetaMaskWallet_instances, "m", _MetaMaskWallet_off).call(this, event, listener);
        });
        _MetaMaskWallet_convertNetworkToId.set(this, (network) => {
            const networkId = network.split(':')[1];
            switch (networkId) {
                case 'mainnet':
                    return 'xrpl:0';
                case 'testnet':
                    return 'xrpl:1';
                case 'devnet':
                    return 'xrpl:2';
                case 'xahau-mainnet':
                    return 'xrpl:21337';
                case 'xahau-testnet':
                    return 'xrpl:21338';
                default:
                    return network;
            }
        });
    }
    get version() {
        return '1.0.0';
    }
    get name() {
        return __classPrivateFieldGet(this, _MetaMaskWallet_name, "f");
    }
    get icon() {
        return __classPrivateFieldGet(this, _MetaMaskWallet_icon, "f");
    }
    get chains() {
        return [XRPL_MAINNET, XRPL_TESTNET, XRPL_DEVNET];
    }
    get features() {
        return {
            'standard:connect': {
                version: '1.0.0',
                connect: __classPrivateFieldGet(this, _MetaMaskWallet_connect, "f"),
            },
            'standard:events': {
                version: '1.0.0',
                on: __classPrivateFieldGet(this, _MetaMaskWallet_on, "f"),
            },
            'xrpl:signTransaction': {
                version: '1.0.0',
                signTransaction: __classPrivateFieldGet(this, _MetaMaskWallet_signTransaction, "f"),
            },
            'xrpl:signAndSubmitTransaction': {
                version: '1.0.0',
                signAndSubmitTransaction: __classPrivateFieldGet(this, _MetaMaskWallet_signAndSubmitTransaction, "f"),
            },
        };
    }
    get accounts() {
        return __classPrivateFieldGet(this, _MetaMaskWallet_accounts, "f");
    }
}
_MetaMaskWallet_name = new WeakMap(), _MetaMaskWallet_icon = new WeakMap(), _MetaMaskWallet_accounts = new WeakMap(), _MetaMaskWallet_listeners = new WeakMap(), _MetaMaskWallet_invokeSnapRequest = new WeakMap(), _MetaMaskWallet_changeNetworkHandler = new WeakMap(), _MetaMaskWallet_signTransactionHandler = new WeakMap(), _MetaMaskWallet_signAndSubmitTransactionHandler = new WeakMap(), _MetaMaskWallet_connect = new WeakMap(), _MetaMaskWallet_signTransaction = new WeakMap(), _MetaMaskWallet_signAndSubmitTransaction = new WeakMap(), _MetaMaskWallet_on = new WeakMap(), _MetaMaskWallet_convertNetworkToId = new WeakMap(), _MetaMaskWallet_instances = new WeakSet(), _MetaMaskWallet_provider_get = function _MetaMaskWallet_provider_get() {
    return window.ethereum;
}, _MetaMaskWallet_emit = function _MetaMaskWallet_emit(event, ...args) {
    var _a;
    (_a = __classPrivateFieldGet(this, _MetaMaskWallet_listeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.forEach((listener) => listener.apply(null, args));
}, _MetaMaskWallet_off = function _MetaMaskWallet_off(event, listener) {
    var _a;
    __classPrivateFieldGet(this, _MetaMaskWallet_listeners, "f")[event] = (_a = __classPrivateFieldGet(this, _MetaMaskWallet_listeners, "f")[event]) === null || _a === void 0 ? void 0 : _a.filter((existingListener) => listener !== existingListener);
};
