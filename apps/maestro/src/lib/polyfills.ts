/**
 * Polyfills BigInt.prototype.toJSON to allow serializing BigInt values to JSON.
 */
if (
  !("toJSON" in BigInt.prototype) ||
  typeof BigInt.prototype.toJSON !== "function"
) {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
}
