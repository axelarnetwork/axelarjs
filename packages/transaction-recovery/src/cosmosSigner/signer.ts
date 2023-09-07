import type { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";

export const getCosmosSigner = async (
  rpcUrl: string,
  offlineDirectSigner: OfflineDirectSigner
) => {
  return SigningStargateClient.connectWithSigner(rpcUrl, offlineDirectSigner);
};
