import { relations } from "drizzle-orm";

import { interchainTokens } from "./interchainTokens";
import { remoteInterchainTokens } from "./remoteInterchainTokens";

export * from "./interchainTokens";
export * from "./remoteInterchainTokens";

/**
 * Table Relations
 */

export const interchainTokenRelations = relations(
  interchainTokens,
  ({ many }) => ({
    remoteInterchainTokens: many(remoteInterchainTokens),
  })
);

export const remoteInterchainTokenRelations = relations(
  remoteInterchainTokens,
  ({ one }) => ({
    interchainToken: one(interchainTokens, {
      fields: [remoteInterchainTokens.originTokenId],
      references: [interchainTokens.tokenId],
    }),
  })
);
