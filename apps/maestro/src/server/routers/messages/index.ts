import { router } from "~/server/trpc";
import { getGlobalMessage } from "./getMessages";
import { setGlobalMessage } from "./setGlobalMessage";

export const messagesRouter = router({
  getGlobalMessage,
  setGlobalMessage,
});

export type MessagesRouter = typeof messagesRouter;
