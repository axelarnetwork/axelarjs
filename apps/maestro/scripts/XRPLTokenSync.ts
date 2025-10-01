import { config } from "dotenv";
config({ path: ".env.local" }); // Load variables from .env.local
import { Client } from "pg";
import https from "https";

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

async function main() {
  // Load DB credentials from env
  const {
    POSTGRES_USER,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    POSTGRES_DATABASE,
    CONFIG_FILE_URL,
  } = process.env;
  
  if (!POSTGRES_USER || !POSTGRES_HOST || !POSTGRES_PASSWORD || !POSTGRES_DATABASE || !CONFIG_FILE_URL) {
    throw new Error("Missing required environment variables");
  }

  const client = new Client({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DATABASE,
    port: 5432,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  // Fetch config
  const config = await fetchJson(CONFIG_FILE_URL);

  // Extract XRPL assets
  const assets = config?.chains?.xrpl?.assets;
  if (!assets || typeof assets !== "object") {
    throw new Error("XRPL assets not found in config");
  }

  console.log("Fetched XRPL assets:", assets);
  return null;

  // Insert tokens into DB (example table: xrpl_tokens)
  for (const [tokenId, tokenInfo] of Object.entries(assets)) {
    const { address } = tokenInfo as { address: string };
    if (!address) continue;

    await client.query(
      `INSERT INTO xrpl_tokens (token_id, address)
       VALUES ($1, $2)
       ON CONFLICT (token_id) DO UPDATE SET address = EXCLUDED.address`,
      [tokenId, address]
    );
    console.log(`Upserted token ${tokenId}: ${address}`);
  }

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});