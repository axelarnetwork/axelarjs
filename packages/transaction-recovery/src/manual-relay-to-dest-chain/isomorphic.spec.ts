import manualRelayToDestChain from "./client";

describe("manualRelayToDestChain", () => {
  test("should work", async () => {
    const response = await manualRelayToDestChain({
      environment: "mainnet",
      txHash:
        "0x3f1175cee93c64b77297a4a4d929d50b7b5e7904a2e1c80d3ce7b61ab0776de2",
      escapeAfterConfirm: false,
      options: {},
    });

    console.log(response);
  });
});
