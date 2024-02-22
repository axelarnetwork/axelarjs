import { Button, Card, Tabs } from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { capitalize } from "@axelarjs/utils";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

import { trpc } from "~/lib/trpc";

const TABS = ["text", "preview"] as const;

type TabKind = (typeof TABS)[number];

export const GlobalMessageManager = () => {
  const { data: globalMessage } = trpc.messages.getGlobalMessage.useQuery(
    undefined,
    { suspense: true }
  );
  const { mutateAsync: saveGlobalMessage, isPending: isSavingGlobalMessage } =
    trpc.messages.setGlobalMessage.useMutation({
      onSuccess() {
        toast.success("Global message saved");
      },
      onError(err) {
        toast.error(err.message);
      },
    });

  const [newMessage, setNewMessage] = useState(globalMessage?.content || "");

  useEffect(() => {
    setNewMessage(globalMessage?.content || "");
  }, [globalMessage]);

  const [activeTab, setActiveTab] = useState<TabKind>("text");

  return (
    <Card className="bg-base-200">
      <Card.Body>
        <Card.Title className="items-center justify-between">
          <span>Global Message</span>
          <Tabs boxed>
            {TABS.map((tab) => (
              <Tabs.Tab
                key={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {capitalize(tab)}
              </Tabs.Tab>
            ))}
          </Tabs>
        </Card.Title>

        {activeTab === "preview" ? (
          <div className="bg-base-100 rounded-lg p-4">
            <Markdown>{newMessage}</Markdown>
          </div>
        ) : (
          <textarea
            className="textarea"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
          />
        )}
        <Card.Actions className="justify-end">
          <Button
            loading={isSavingGlobalMessage}
            variant="primary"
            onClick={async () => {
              if (globalMessage) {
                await saveGlobalMessage({
                  ...globalMessage,
                  content: newMessage,
                });
              }
            }}
          >
            Save global message
          </Button>
        </Card.Actions>
      </Card.Body>
    </Card>
  );
};
