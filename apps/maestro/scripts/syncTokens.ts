import { config } from "dotenv";
config({ path: ".env.local" }); // Load variables from .env.local
import { Client } from "pg";
import { createAxelarConfigClient } from "../../../packages/api/axelar-config";

async function main() {
  // Load axelar config
  const {
    NEXT_PUBLIC_NETWORK_ENV
  } = process.env;

  if (!NEXT_PUBLIC_NETWORK_ENV) {
    throw new Error("Missing required environment variable NEXT_PUBLIC_NETWORK_ENV");
  }

  if (!["testnet", "mainnet", "devnet-amplifier"].includes(NEXT_PUBLIC_NETWORK_ENV)) {
    throw new Error("Invalid network env");
  }

  const axelarConfigClient = createAxelarConfigClient(NEXT_PUBLIC_NETWORK_ENV as any);
  const config = await axelarConfigClient.getAxelarConfigs();

  // Load DB credentials from env
  const {
    POSTGRES_USER,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    POSTGRES_DATABASE,
  } = process.env;
  
  if (!POSTGRES_USER || !POSTGRES_HOST || !POSTGRES_PASSWORD || !POSTGRES_DATABASE) {
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

  // Extract asset information
  const assets = config?.assets;
  if (!assets || typeof assets !== "object") {
    throw new Error("Assets not found in config");
  }

  // did the user request to purge all imported tokens?
  const deleteImported = process.argv.includes("--delete-imported");
  if (deleteImported) {
    console.log("Deleting all imported tokens before syncing");
    try {
      client.query("DELETE FROM remote_interchain_tokens WHERE imported = true");
      client.query("DELETE FROM interchain_tokens WHERE imported = true");
    }
    catch (err) {
      console.error("Failed to delete tokens:", err);
      throw err;
    }
  }


  // I want to query everything from table interchain_tokens
  let currentTokens;
  try {
    const res = await client.query("SELECT * FROM interchain_tokens");
    currentTokens = res.rows.reduce((acc, row) => {
      acc[row.token_id] = row;
      return acc;
    }, {} as Record<string, any>);
  } catch (err) {
    console.error("Error querying interchain_tokens:", err);
    await client.end();
    throw err;
  }

  let tokensAdded = [];
  let tokensIgnored = [];
  let tokensAlreadyPresent = [];

  for (const [tokenId, tokenInfo] of Object.entries(assets)) {
    // check if this token is unsupported
    if(tokenInfo.type != "customInterchain" && tokenInfo.type != "interchain") {
      tokensIgnored.push(tokenId);
      continue;
    }
    if (tokenInfo.type == "customInterchain") {
      tokenInfo.type = "interchain"; // normalize to interchain
    }

    // check if this token is already in the interchain_tokens table
    if (currentTokens[tokenId]) {
      tokensAlreadyPresent.push(tokenId);
      continue;
    }

    // add this to the database now
    // the format is token_id, token_address, axelar_chain_id, token_name, token_symbol, token_decimals, deployment_message_id, deployer_address, token_manager_address, token_manager_type, original_minter_address, kind, salt, updated_at, created_at
    // this is an example:
    /*
     {
        id: '0xc6b71ecb80f8f32ff4044b7c813f2af80029064883624fa7940b79ba3aaa864b',
        prettySymbol: 'TEST',
        name: 'Test',
        decimals: 18,
        originAxelarChainId: 'ethereum-sepolia',
        coingeckoId: '',
        iconUrl: '/images/tokens/sqd.svg',
        type: 'interchain',
        details: {
          deployer: '0xba76c6980428A0b10CFC5d8ccb61949677A61233',
          deploySalt: '0xdb508c07da6d2fa51f6bd2680fcd784c1400885e18bb2b1c2cc167267cb50229',
          deploymentMessageId: '0x',
          originalMinter: ''
        },
        chains: {
          sui: {
            tokenAddress: '0x3b09fe0f78b65b4d1c9dcf08d5a7a0f5d70246e9925f03f61ea3f4a954406c76::test::TEST',
            symbol: 'TEST',
            name: 'Test',
            tokenManager: '0x9625c5709c95db082afb49c320cbca3cc0de2a929dbe6170f82193d2269d741a',
            tokenManagerType: 'mintBurn',
            decimals: 6
          },
          'ethereum-sepolia': {
            tokenAddress: '0x6a3d312C98eF92d1520D7255A5b7d9B3C612B771',
            symbol: 'TEST',
            name: 'Test',
            tokenManager: '0x23FD1014f7F11121f3FCd53bc0b8CF3bc130efe2',
            tokenManagerType: 'lockUnlock',
            decimals: 18
          },
          xrpl: {
            tokenAddress: '5445535400000000000000000000000000000000.rNrjh1KGZk2jBR3wPfAQnoidtFFYQKbQn2',
            symbol: 'TEST',
            name: 'Test',
            tokenManager: 'rNrjh1KGZk2jBR3wPfAQnoidtFFYQKbQn2',
            tokenManagerType: 'mintBurn',
            decimals: 15
          }
        }
      }
  */
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
        `Original chain ${tokenInfo.originAxelarChainId} not found in tokenInfo.chains for token ${tokenId}, consider adding an extra rule`
      );
      throw new Error();
    }

    // Use the correct fields from the example token structure
    try {
      await client.query(
        `INSERT INTO interchain_tokens
          (token_id, token_address, axelar_chain_id, token_name, token_symbol, token_decimals, deployment_message_id, deployer_address, token_manager_address, token_manager_type, original_minter_address, kind, salt, updated_at, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
          RETURNING *`,
        [
          tokenId, // token_id
          originalChain.tokenAddress, // token_address // from the original chain object
          tokenInfo.originAxelarChainId, // axelar_chain_id
          tokenInfo.name, // token_name
          tokenInfo.prettySymbol, // token_symbol
          tokenInfo.decimals, // token_decimals // decimals from the original chain object
          tokenInfo.details?.deploymentMessageId ?? "0x", // deployment_message_id // if this doesn't exist, we still have to set it to 0x - otherwise the token will not show up as deployed
          tokenInfo.details?.deployer ?? null, // deployer_address
          originalChain.tokenManager ?? null, // token_manager_address
          originalChain.tokenManagerType?.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() ?? null, // token_manager_type
          tokenInfo.details?.originalMinter ?? null, // original_minter_address
          tokenInfo.type, // kind
          tokenInfo.details?.deploySalt ?? "0x", // salt
          // NOW() as created_at (there are no timestamps in the config)
          // NOW() as updated_at (there are no timestamps in the config)
        ]
      );
    }
    catch (err) {
      console.error(`Error inserting token ${tokenId}:`, err);
      throw err;
    }

    tokensAdded.push(tokenId);

    // also add remote_interchain_tokens entries for each chain
    for (const [chainId, chainInfo] of Object.entries(tokenInfo.chains || {})) {
      if (chainId === tokenInfo.originAxelarChainId) continue; // skip original chain

      try { 
        await client.query(
          `INSERT INTO remote_interchain_tokens
            (id, token_id, axelar_chain_id, token_address, token_manager_address, token_manager_type, deployment_message_id, deployment_status, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            RETURNING *`,
          [
            `${chainId}:${chainInfo.tokenAddress}`, // id // composite key
            tokenId, // token_id
            chainId, // axelar_chain_id
            chainInfo.tokenAddress, // token_address
            chainInfo.tokenManager ?? null, // token_manager_address
            chainInfo.tokenManagerType?.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() ?? null, // token_manager_type
            tokenInfo.details?.deploymentMessageId ?? null, // deployment_message_id
            'confirmed', // deployment_status // assume deployment confirmed if present in config
            // NOW() as created_at (there are no timestamps in the config)
            // NOW() as updated_at (there are no timestamps in the config)
          ]
        );
      } catch (err) {
        console.error(`Error inserting remote token ${tokenId} for chain ${chainId}:`, err);
        throw err;
      }
    }
  }
  await client.end();

  console.log("Tokens synced successfully");

  console.log("\n🟢 Tokens Added Successfully:");
  if (tokensAdded.length) {
    tokensAdded.forEach(token => console.log(`- ${token}`));
  } else {
    console.log("-- None --");
  }

  console.log("\n🟡 Tokens Ignored:");
  if (tokensIgnored.length) {
    tokensIgnored.forEach(token => console.log(`- ${token}`));
  } else {
    console.log("-- None --");
  }

  console.log("\n🔵 Tokens Already Present:");
  if (tokensAlreadyPresent.length) {
    tokensAlreadyPresent.forEach(token => console.log(`- ${token}`));
  } else {
    console.log("-- None --");
  }

  return;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});