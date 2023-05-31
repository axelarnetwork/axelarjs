import { Card } from "@axelarjs/ui";

import Page from "~/layouts/Page";

type Props = {};

const SendInterchainToken = (_props: Props) => {
  return (
    <Page className="place-items-center">
      <Card className="bg-base-200">
        <Card.Body>
          <Card.Title>Send Interchain Token</Card.Title>
        </Card.Body>
      </Card>
    </Page>
  );
};

export default SendInterchainToken;
