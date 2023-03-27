import React from "react";

import { Card } from "@axelarjs/ui";

import Page from "~/layouts/Page";

type Props = {};

const DeployInterchainToken = (props: Props) => {
  return (
    <Page className="place-items-center">
      <Card className="bg-base-200">
        <Card.Body>
          <Card.Title>Deploy Interchain Token</Card.Title>
        </Card.Body>
      </Card>
    </Page>
  );
};

export default DeployInterchainToken;
