import { config } from "dotenv";
config({ path: ".env.local" }); // Load variables from .env.local
import { Client } from "pg";
import https from "https";
import http from "http";

//import { CHAIN_CONFIGS } from "~/config/chains"; // Import doesn't work

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    let protocol: any = http;
    if(url.startsWith("https"))
      protocol = https;
    protocol.get(url, (res) => {
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

  // Extract asset information
  const assets = config?.assets;
  if (!assets || typeof assets !== "object") {
    throw new Error("XRPL assets not found in config");
  }

  // I want to query everything from table interchain_tokens
  let currentTokens;
  try {
    const res = await client.query("SELECT * FROM interchain_tokens");
    currentTokens = res.rows.reduce((acc, row) => {
      acc[row.token_id] = row;
      return acc;
    }, {} as Record<string, any>);
    console.log("Current interchain_tokens:", currentTokens);
  } catch (err) {
    console.error("Error querying interchain_tokens:", err);
    await client.end();
    return null;
  }

  for (const [tokenId, tokenInfo] of Object.entries(assets)) {
    // check if this token is a custom token
    if(tokenInfo.type != "customInterchain" && tokenInfo.type != "interchain") {//if (!/^0x[a-fA-F0-9]{64}$/.test(tokenId)) {
      //console.log(`Skipping token ${tokenId} of type ${tokenInfo.type}`);
      continue;
    }
    if (tokenInfo.type == "customInterchain") {
      tokenInfo.type = "interchain"; // normalize to interchain
    }

    // check if this token is already in the interchain_tokens database
    if (currentTokens[tokenId]) {
      console.log(`Token ${tokenId} already exists in interchain_tokens, skipping`);
      continue;
    }

    // add this to the database now
    // the format is token_id, token_address, axelar_chain_id, token_name, token_symbol, token_decimals, deployment_message_id, deployer_address, token_manager_address, token_manager_type, original_minter_address, kind, salt, updated_at, created_at
    // this is an example:
    /*
      id: '0xcf24134c93dcca4c1cfa6595dc337849d9e9e5507c3cbffd937d617e015e81f9',
      prettySymbol: 'YSLC',
      name: 'Slime Coin',
      decimals: 18,
      originAxelarChainId: 'Moonbeam',
      coingeckoId: '',
      iconUrl: '/images/tokens/yslc.svg',
      type: 'interchain',
      details: {
        deployer: '0x25A967Ab86b379356AAf9Ad8264f78EAE82D5dc9',
        deploySalt: '0x7a71c517e9782dcb798591899dc5ee04a0cd836e06ecd7edc7df5ba4ad658e14',
        deploymentMessageId: '0xa415b4a4c28c71b37c59c49c3def35e447a6fce9c4f230cff8800ebd550a9faf-0',
        originalMinter: ''
      },
  }*/
    console.log(`Token ${tokenId} is missing in interchain_tokens, should be added:`, tokenInfo);
    /*
    // attempt to get original chain by accessing tokenInfo.chains[tokenInfo.originAxelarChainId]
    let originalChain = tokenInfo.chains[tokenInfo.originAxelarChainId];
    if (!originalChain) {
      console.warn(`Original chain ${tokenInfo.originalAxelarChainId} not found in tokenInfo.chains for token ${tokenId}, attempting to infer from known chains`);
      let originalChainConfig = CHAIN_CONFIGS.find(c => c.axelarChainName === tokenInfo.originalAxelarChainId);
      if (!originalChainConfig) {
        console.error(`Could not find chain config for originalAxelarChainId ${tokenInfo.originalAxelarChainId}, skipping token ${tokenId}`);
        continue;
      }
      originalChain = tokenInfo.chains[originalChainConfig.axelarChainId];
      if (!originalChain) {
        console.error(`Could not find chain info for original chain ${originalChainConfig.axelarChainId} in tokenInfo.chains, skipping token ${tokenId}`);
        continue;
      }
    }*/
    
    // attempt to get original chain by accessing tokenInfo.chains[tokenInfo.originAxelarChainId]
    let originalChain =
      tokenInfo.chains?.[tokenInfo.originAxelarChainId] ||
      tokenInfo.chains?.[tokenInfo.originAxelarChainId?.toLowerCase()];
    if (!originalChain) {
      console.error(
        `Original chain ${tokenInfo.originAxelarChainId} not found in tokenInfo.chains for token ${tokenId}, skipping token`
      );
      continue;
    }

    // Use the correct fields from the example token structure
    try {
      let result = await client.query(
        `INSERT INTO interchain_tokens
          (token_id, token_address, axelar_chain_id, token_name, token_symbol, token_decimals, deployment_message_id, deployer_address, token_manager_address, token_manager_type, original_minter_address, kind, salt, updated_at, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
          RETURNING *`,
        [
          tokenId,
          originalChain.tokenAddress, // from the original chain object
          tokenInfo.originAxelarChainId,
          tokenInfo.name,
          tokenInfo.prettySymbol,
          tokenInfo.decimals, // decimals from the original chain object
          tokenInfo.details?.deploymentMessageId ?? "0x",
          tokenInfo.details?.deployer ?? null,
          originalChain.tokenManager ?? null,
          originalChain.tokenManagerType.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() ?? null,
          tokenInfo.details?.originalMinter ?? null,
          tokenInfo.type,
          tokenInfo.details?.deploySalt ?? "0x",
        ]
      );
    }
    catch (err) {
      console.error(`Error inserting token ${tokenId}:`, err);
      continue;
    }

    // also add remote_interchain_tokens entries for each chain
    for (const [chainId, chainInfo] of Object.entries(tokenInfo.chains || {})) {
      if (chainId === tokenInfo.originAxelarChainId) continue; // skip original chain

      try { 
        let result = await client.query(
        `INSERT INTO remote_interchain_tokens
          (id, token_id, axelar_chain_id, token_address, token_manager_address, token_manager_type, deployment_message_id, deployment_status, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
          RETURNING *`,
        [
          `${chainId}:${chainInfo.tokenAddress}`, // composite key
          tokenId,
          chainId,
          chainInfo.tokenAddress,
          chainInfo.tokenManager ?? null,
          chainInfo.tokenManagerType.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() ?? null,
          tokenInfo.details?.deploymentMessageId ?? null,
          'confirmed', // assume deployment confirmed if present in config
        ]
      );
      } catch (err) {
        console.error(`Error inserting remote token ${tokenId} for chain ${chainId}:`, err);
        continue;
      }
    }
  }
  await client.end();

  //console.log("Fetched assets:", assets);
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