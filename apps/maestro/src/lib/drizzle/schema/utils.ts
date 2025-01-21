import { DeploymentMessageId } from "./types";

export function decodeDeploymentMessageId(
  deploymentMessageId: DeploymentMessageId
) {
  const [hash, index] = deploymentMessageId.split("-");

  return {
    hash: hash,
    index: parseInt(index),
  };
}

export function encodeDeploymentMessageId(
  hash: `${string}`,
  index: number
): DeploymentMessageId {
  return `${hash}-${index}`;
}
