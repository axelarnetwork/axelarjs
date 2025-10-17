/**
 * Returns a normalized token address for address-compatibility comparisons.
 * - For Sui coin types (package::module::struct), we compare only the package part length
 *   to the owner address length.
 */
export function normalizeTokenAddressForCompatibility(tokenAddress?: string) {
  if (!tokenAddress) return tokenAddress;
  return tokenAddress.includes(":") ? tokenAddress.split(":")[0] : tokenAddress;
}

/**
 * Determines if a token address is incompatible with the owner address format/length.
 * If either is missing, we treat it as incompatible to allow upstream callers
 * to disable queries/UI sections appropriately.
 */
export function isTokenAddressIncompatibleWithOwner(
  tokenAddress?: string,
  ownerAddress?: string
): boolean {
  if (!tokenAddress || !ownerAddress) return true;
  const normalized = normalizeTokenAddressForCompatibility(tokenAddress);
  return normalized?.length !== ownerAddress.length;
}
