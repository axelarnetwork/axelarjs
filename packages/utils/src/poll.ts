import { sleep } from "./sleep";

export async function poll<T>(
  fn: () => Promise<T>,
  keepGoingCondition: (...params: any[]) => boolean,
  ms: number,
  maxTries: number,
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
