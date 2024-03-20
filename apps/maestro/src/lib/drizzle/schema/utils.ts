import { DeploymentMessageId } from "./types";

export function decodeDeploymentMessageId(
  deploymentMessageId: DeploymentMessageId,
) {
  const [hash, index] = deploymentMessageId.split("-");

  return {
    hash: hash as `0x${string}`,
    index: parseInt(index),
  };
}

export function encodeDeploymentMessageId(
  hash: `0x${string}`,
  index: number,
): DeploymentMessageId {
  return `${hash}-${index}`;
}
