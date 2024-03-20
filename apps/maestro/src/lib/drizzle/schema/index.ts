import { relations } from "drizzle-orm";

import { interchainTokens } from "./interchainTokens";
import { remoteInterchainTokens } from "./remoteInterchainTokens";

export * from "./types";
export * from "./utils";

export * from "./interchainTokens";
export * from "./remoteInterchainTokens";
export * from "./auditLogs";

/**
 * Table Relations
 */

export const interchainTokenRelations = relations(
  interchainTokens,
  // one interchain token has many remote interchain tokens
  ({ many }) => ({
    remoteTokens: many(remoteInterchainTokens),
  }),
);

export const remoteInterchainTokenRelations = relations(
  remoteInterchainTokens,
  // one remote interchain token has one interchain token
  ({ one }) => ({
    originToken: one(interchainTokens, {
      fields: [remoteInterchainTokens.tokenId],
      references: [interchainTokens.tokenId],
    }),
  }),
);
