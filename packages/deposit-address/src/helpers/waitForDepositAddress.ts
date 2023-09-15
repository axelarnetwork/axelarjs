export function waitForDepositAddress() {
  const result = poll();
}

async function poll(fn: any, fnCondition: any, ms: number) {
  let result = await fn();
  while (fnCondition(result)) {
    await sleep(ms);
    result = await fn();
  }
  return result;
}

function sleep(ms = 1000) {
  return new Promise((res) => setTimeout(res, ms));
}
