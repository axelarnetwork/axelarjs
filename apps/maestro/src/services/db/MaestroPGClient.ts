import type { DBClient } from "~/lib/drizzle/client";

export type RecordInterchainTokenDeploymentVariables = {};

export type RecordRemoteInterchainTokenDeploymentVariables = {};

export default class MaestroPGClient {
  constructor(private db: DBClient) {}

  async recordInterchainTokenDeployment(
    _variables: RecordInterchainTokenDeploymentVariables
  ) {
    const { db } = this;

    return db.transaction(async (_trx) => {
      // TODO
    });
  }

  async recordRemoteInterchainTokenDeployment(
    _variables: RecordRemoteInterchainTokenDeploymentVariables
  ) {
    const { db } = this;

    return db.transaction(async (_trx) => {
      // TODO
    });
  }
}
