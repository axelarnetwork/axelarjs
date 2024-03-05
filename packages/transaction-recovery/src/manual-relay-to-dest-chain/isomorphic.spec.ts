import manualRelayToDestChain from "./client";

describe("manualRelayToDestChain", () => {
  test("should work", async () => {
    const response = await manualRelayToDestChain({
      environment: "mainnet",
      txHash:
        "0x4a2f45fca07051e25407edb253b305946554054c5177e9b4d5a80d1ab858f82d",
      escapeAfterConfirm: false,
      options: {},
    });

    console.log(response);
  });
});
