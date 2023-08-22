import type { DBClient } from "~/lib/drizzle/client";

export type RecordInterchainTokenDeploymentVariables = {};

export type RecordRemoteInterchainTokenDeploymentVariables = {};

export default class MaestroPGClient {
  constructor(private db: DBClient) {}

  async recordInterchainTokenDeployment(
    variables: RecordInterchainTokenDeploymentVariables
  ) {
    const { db } = this;

    return db.transaction(async (trx) => {
      // TODO
    });
  }

  async recordRemoteInterchainTokenDeployment(
    variables: RecordRemoteInterchainTokenDeploymentVariables
  ) {
    const { db } = this;

    return db.transaction(async (trx) => {
      // TODO
    });
  }
}
