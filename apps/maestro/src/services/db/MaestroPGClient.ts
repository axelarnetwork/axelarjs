import type { DBClient } from "~/lib/drizzle/client";

export type RecordInterchainTokenDeploymentVariables = {};

export type RecordRemoteInterchainTokenDeploymentVariables = {};

export default class MaestroPGClient {
  constructor(private db: DBClient) {}

  /**
   * Records the deployment of an interchain token.
   *
   * @param _variables
   * @returns
   */
  async recordInterchainTokenDeployment(
    _variables: RecordInterchainTokenDeploymentVariables
  ) {
    const { db } = this;

    return db.transaction(async (_trx) => {
      // TODO
    });
  }

  /**
   * Records the deployment of a remote interchain token.
   *
   * @param _variables
   * @returns
   */
  async recordRemoteInterchainTokenDeployment(
    _variables: RecordRemoteInterchainTokenDeploymentVariables
  ) {
    const { db } = this;

    return db.transaction(async (_trx) => {
      // TODO
    });
  }
}
