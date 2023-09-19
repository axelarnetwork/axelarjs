export async function sleep(ms = 1000) {
  return new Promise((res) => setTimeout(res, ms));
}
