function getEnvironmentFromUrl(url: string): string {
  const environments = [
    "mainnet",
    "testnet",
    "stagenet",
    "devnet-verifiers",
    "devnet-amplifier",
  ];

  for (const env of environments) {
    if (url.includes(`/${env}/`)) {
      return env;
    }
  }

  throw new Error("Invalid environment in URL");
}

export default getEnvironmentFromUrl;
