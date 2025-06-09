import { ENVIRONMENTS } from "@axelarjs/core";

import { validate } from "jsonschema";

import type {
  AxelarConfigClient,
  AxelarConfigsResponse,
} from "../../axelar-config";
import { createAxelarConfigClient } from "../client";
import schema from "./axelar-config.schema.json";
import stub from "./stub.json";

describe("axelar-config (node client)", () => {
  describe("axelar config client", () => {
    let api: AxelarConfigClient;

    beforeEach(() => {
      api = createAxelarConfigClient(ENVIRONMENTS.testnet);
    });

    test("It should return the config client", async () => {
      // TODO: only validating stubbed until this PR is merged with new json config: https://github.com/axelarnetwork/chains/pull/515
      const configs: AxelarConfigsResponse = await api.getAxelarConfigs();
      const stubbed: unknown = stub;

      expect(configs).toBeTruthy();
      expect(validate(stubbed, schema).errors.length).toEqual(0);
    });
  });
});
