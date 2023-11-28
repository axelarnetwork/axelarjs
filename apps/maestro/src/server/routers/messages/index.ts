import { router } from "~/server/trpc";
import { getGlobalMessage } from "./getMessages";

export const messagesRouter = router({
  getGlobalMessage,
});

export type MessagesRouter = typeof messagesRouter;
