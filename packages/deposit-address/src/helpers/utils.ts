export const isStrEqual = (a: string | undefined, b: string) =>
  a?.toLowerCase() === b?.toLowerCase();

export async function sleep(ms = 1000) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function poll(
  fn: any,
  keepGoingCondition: any,
  ms: number,
  maxTries: number
) {
  let tries = 0;
  let results = await fn();

  while (keepGoingCondition(results) && tries < maxTries) {
    await sleep(ms);
    results = await fn();
    tries++;
  }
  return Promise.resolve(results);
}
