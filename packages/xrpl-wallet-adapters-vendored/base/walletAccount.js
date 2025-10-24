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
var _XRPLWalletAccount_publicKey, _XRPLWalletAccount_address;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XRPLWalletAccount = void 0;
const core_1 = require("../core");
class XRPLWalletAccount {
    get address() {
        return __classPrivateFieldGet(this, _XRPLWalletAccount_address, "f");
    }
    get publicKey() {
        return __classPrivateFieldGet(this, _XRPLWalletAccount_publicKey, "f").slice();
    }
    get chains() {
        return [core_1.XRPL_MAINNET];
    }
    get features() {
        return ['xrpl:signTransaction', 'xrpl:signAndSubmitTransaction'];
    }
    constructor(address) {
        _XRPLWalletAccount_publicKey.set(this, void 0);
        _XRPLWalletAccount_address.set(this, void 0);
        if (new.target === XRPLWalletAccount) {
            Object.freeze(this);
        }
        __classPrivateFieldSet(this, _XRPLWalletAccount_address, address, "f");
    }
}
exports.XRPLWalletAccount = XRPLWalletAccount;
_XRPLWalletAccount_publicKey = new WeakMap(), _XRPLWalletAccount_address = new WeakMap();
