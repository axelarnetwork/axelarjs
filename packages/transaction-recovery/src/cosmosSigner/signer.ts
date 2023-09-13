import type { OfflineSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";

export const getCosmosSigner = async (
  rpcUrl: string,
  offlineDirectSigner: OfflineSigner
) => {
  return SigningStargateClient.connectWithSigner(rpcUrl, offlineDirectSigner);
};
