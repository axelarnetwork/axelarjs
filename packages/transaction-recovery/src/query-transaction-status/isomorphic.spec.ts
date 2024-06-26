import { queryTransactionStatus } from "./client";

describe("queryTransactionStatus", () => {
  const environment = "mainnet";

  test("should return success false when the tx is not found", async () => {
    const txHash = "0x1234567890";
    const result = await queryTransactionStatus({
      txHash,
      environment,
    });

    expect(result.success).toEqual(false);
    expect(result.error).toEqual("Transaction not found");
  });

  test("should return success true when the given tx hash for cosmos tx exists", async () => {
    const txHash =
      "A08331DC2FCA287B96D8F93C9FAA34A9C90BFA48A1D1A230108B7F563925AA8F";
    const result = await queryTransactionStatus({
      txHash,
      environment,
    });
    expect(result.success).toEqual(true);
    expect(result.data?.status).toBeDefined();
    expect(result.data?.timeSpent).toBeDefined();
    expect(result.data?.gasPaidInfo).toBeDefined();
    expect(result.data?.callTx).toBeDefined();
    expect(result.data?.executed).toBeDefined();

    const resultForLowerCaseTxHash = await queryTransactionStatus({
      txHash: txHash.toLowerCase(),
      environment,
    });
    expect(resultForLowerCaseTxHash.success).toEqual(true);
  });

  test("should return success true when the given tx hash for evm tx exists", async () => {
    const txHash =
      "0x9d396b11115455ffdf32294915ccfb12e3ae48e7c89f85e1f3fc6bfb591d1a3e";
    const result = await queryTransactionStatus({
      txHash,
      environment,
    });
    expect(result.success).toEqual(true);
    expect(result.data?.status).toBeDefined();
    expect(result.data?.timeSpent).toBeDefined();
    expect(result.data?.gasPaidInfo).toBeDefined();
    expect(result.data?.callTx).toBeDefined();
    expect(result.data?.executed).toBeDefined();
  });

  test("should return expressExecuted and expressExecutedAt when the given tx hash is express tx", async () => {
    const txHash =
      "0xac8b22c4ae0890832adcbca19f8bfd0db734a6bf00a99fe839ca6d1055b9942b";
    const result = await queryTransactionStatus({
      txHash,
      environment,
    });
    expect(result.success).toEqual(true);
    expect(result.data?.expressExecuted).toBeDefined();
    expect(result.data?.expressExecutedAt).toBeDefined();
  });
});
