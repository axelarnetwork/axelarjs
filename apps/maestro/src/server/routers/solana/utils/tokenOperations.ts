import { BN } from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import type { Context } from "~/server/context";
import {
  canonicalInterchainTokenId,
  findCallContractSigningPda,
  findGasConfigPda,
  findGatewayRootPda,
  findInterchainTokenPda,
  findItsRootPda,
  findMetadataPda,
  findTokenManagerPda,
  findUserRolesPda,
  interchainTokenId,
  TOKEN_METADATA_PROGRAM_ID,
} from "./solanaPda";
import {
  DeployInterchainTokenInput,
  RegisterCanonicalInterchainTokenInput,
  type DeployRemoteCanonicalInterchainTokenInput,
  type DeployRemoteInterchainTokenInput,
  type InterchainTransferInput,
} from "./types";
import {
  encodeStringBorsh,
  encodeU32LE,
  encodeU64LE,
  encodeVariantU8,
  getAxelarGasServiceProgramId,
  getGatewayProgramId,
  getItsProgramId,
  getSolanaChainConfig,
  hexToBytes32,
} from "./utils";

// SPL Token program ID (regular SPL tokens)
const SPL_TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export async function buildDeployInterchainTokenTxBytes(
  ctx: Context,
  input: DeployInterchainTokenInput
): Promise<{
  txBase64: string;
  tokenId: string;
  tokenAddress: string;
  tokenManagerAddress: string;
}> {
  const chainConfig = await getSolanaChainConfig(ctx);

  const rpcUrl = chainConfig.config.rpc?.[0];
  if (!rpcUrl) throw new Error("No Solana RPC configured");

  const itsProgramId = await getItsProgramId(ctx);
  const caller = new PublicKey(input.caller);
  const connection = new Connection(rpcUrl, "confirmed");

  const salt = Buffer.from(hexToBytes32(input.salt));
  const tokenId = interchainTokenId(caller, salt);
  const [itsRootPda] = findItsRootPda(itsProgramId);

  const [tokenManagerPda] = findTokenManagerPda(
    itsProgramId,
    itsRootPda,
    tokenId
  );

  const [mint] = findInterchainTokenPda(itsProgramId, itsRootPda, tokenId);
  const tokenManagerAta = getAssociatedTokenAddressSync(
    mint,
    tokenManagerPda,
    true,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const payerAta = getAssociatedTokenAddressSync(
    mint,
    caller,
    true,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const [itsUserRolesPda] = findUserRolesPda(
    itsProgramId,
    tokenManagerPda,
    itsRootPda
  );
  const [metadataAccount] = findMetadataPda(mint);
  const minter = input.minterAddress
    ? new PublicKey(input.minterAddress)
    : null;
  const optionalMinterRolesPda = minter
    ? findUserRolesPda(itsProgramId, tokenManagerPda, minter)[0]
    : undefined;

  // Borsh encoding: 0-based variant index 9 + salt + name + symbol + decimals + initial_supply
  const data = Buffer.concat([
    encodeVariantU8(9),
    salt, // [u8; 32]
    encodeStringBorsh(input.tokenName),
    encodeStringBorsh(input.tokenSymbol),
    Buffer.from([input.decimals]),
    encodeU64LE(new BN(input.initialSupply).toString()),
  ]);

  // Account order must match program's builder (instruction.rs::deploy_interchain_token)
  const keys = [
    { pubkey: caller, isSigner: true, isWritable: true },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: itsRootPda, isSigner: false, isWritable: false },
    { pubkey: tokenManagerPda, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: true },
    { pubkey: tokenManagerAta, isSigner: false, isWritable: true },
    { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: itsUserRolesPda, isSigner: false, isWritable: true },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: TOKEN_METADATA_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: metadataAccount, isSigner: false, isWritable: true },
    { pubkey: payerAta, isSigner: false, isWritable: true },
  ];

  if (minter && optionalMinterRolesPda) {
    keys.push({ pubkey: minter, isSigner: false, isWritable: false });
    keys.push({
      pubkey: optionalMinterRolesPda,
      isSigner: false,
      isWritable: true,
    });
  }

  const ix = new TransactionInstruction({
    programId: itsProgramId,
    keys,
    data,
  });

  const tx = new Transaction().add(ix);
  tx.feePayer = caller;
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  const txBase64 = tx
    .serialize({ requireAllSignatures: false, verifySignatures: false })
    .toString("base64");

  const tokenIdHex = `0x${Buffer.from(tokenId).toString("hex")}`;

  return {
    txBase64,
    tokenId: tokenIdHex,
    tokenAddress: mint.toBase58(),
    tokenManagerAddress: tokenManagerPda.toBase58(),
  };
}

export async function buildRegisterCanonicalInterchainTokenTxBytes(
  ctx: Context,
  input: RegisterCanonicalInterchainTokenInput
): Promise<{
  txBase64: string;
  tokenId: string;
  tokenAddress: string;
  tokenManagerAddress: string;
}> {
  const chainConfig = await getSolanaChainConfig(ctx);

  const rpcUrl = chainConfig.config.rpc?.[0];
  if (!rpcUrl) throw new Error("No Solana RPC configured");

  const itsProgramId = await getItsProgramId(ctx);
  const caller = new PublicKey(input.caller);
  const connection = new Connection(rpcUrl, "confirmed");

  const mint = new PublicKey(input.tokenAddress);
  const tokenId = canonicalInterchainTokenId(mint);
  const [itsRootPda] = findItsRootPda(itsProgramId);

  const [tokenManagerPda] = findTokenManagerPda(
    itsProgramId,
    itsRootPda,
    tokenId
  );

  const [metadataAccount] = findMetadataPda(mint);

  // Check if the mint exists and get its owner
  const mintAccountInfo = await connection.getAccountInfo(mint);
  if (!mintAccountInfo) {
    throw new Error(`Mint account ${mint.toBase58()} not found`);
  }

  // Support both SPL Token and TOKEN_2022 programs
  const isToken2022 = mintAccountInfo.owner.equals(TOKEN_2022_PROGRAM_ID);
  const isSplToken = mintAccountInfo.owner.equals(SPL_TOKEN_PROGRAM_ID);

  if (!isToken2022 && !isSplToken) {
    throw new Error(
      `Token must be owned by either SPL Token or TOKEN_2022 program. Found owner: ${mintAccountInfo.owner.toBase58()}`
    );
  }

  // Get associated token accounts - use the correct token program
  const tokenProgramId = isToken2022
    ? TOKEN_2022_PROGRAM_ID
    : SPL_TOKEN_PROGRAM_ID;
  const tokenManagerAta = getAssociatedTokenAddressSync(
    mint,
    tokenManagerPda,
    true,
    tokenProgramId,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // Get user roles PDA - required by the program
  const [itsUserRolesPda] = findUserRolesPda(
    itsProgramId,
    tokenManagerPda,
    itsRootPda
  );

  // instruction encoding - variant 6 for registerCanonicalInterchainToken
  const data = Buffer.concat([
    Buffer.from([6]), // instruction variant
  ]);

  const keys = [
    { pubkey: caller, isSigner: true, isWritable: true }, // 0. [writable,signer] The address of the payer
    { pubkey: metadataAccount, isSigner: false, isWritable: false }, // 1. [] The Metaplex metadata account associated with the mint
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 2. [] The system program account
    { pubkey: itsRootPda, isSigner: false, isWritable: false }, // 3. [] The ITS root account
    { pubkey: tokenManagerPda, isSigner: false, isWritable: true }, // 4. [writable] The token manager account derived from the `token_id` that will be initialized
    { pubkey: mint, isSigner: false, isWritable: false }, // 5. [] The mint account (token address) of the original token
    { pubkey: tokenManagerAta, isSigner: false, isWritable: true }, // 6. [writable] The token manager Associated Token Account
    { pubkey: tokenProgramId, isSigner: false, isWritable: false }, // 7. [] The token program account that was used to create the mint (`spl_token` vs `spl_token_2022`)
    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 8. [] The Associated Token Account program account (`spl_associated_token_account`)
    { pubkey: itsUserRolesPda, isSigner: false, isWritable: true }, // 9. [writable] The user roles PDA
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, // 10. [] The rent sysvar account
  ];

  const ix = new TransactionInstruction({
    programId: itsProgramId,
    keys,
    data,
  });

  const tx = new Transaction().add(ix);
  tx.feePayer = caller;
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  const txBase64 = tx
    .serialize({ requireAllSignatures: false, verifySignatures: false })
    .toString("base64");

  const tokenIdHex = `0x${Buffer.from(tokenId).toString("hex")}`;

  return {
    txBase64,
    tokenId: tokenIdHex,
    tokenAddress: mint.toBase58(),
    tokenManagerAddress: tokenManagerPda.toBase58(),
  };
}

export async function buildDeployRemoteInterchainTokenTxBytes(
  ctx: Context,
  input: DeployRemoteInterchainTokenInput
): Promise<{ txBase64: string; tokenId: string; tokenAddress: string }> {
  const chainConfig = await getSolanaChainConfig(ctx);
  const rpcUrl = chainConfig.config.rpc?.[0];
  if (!rpcUrl) throw new Error("No Solana RPC configured");

  const itsProgramId = await getItsProgramId(ctx);
  const gatewayProgramId = await getGatewayProgramId(ctx);
  const gasServiceProgramId = await getAxelarGasServiceProgramId(ctx);
  const caller = new PublicKey(input.caller);
  const connection = new Connection(rpcUrl, "confirmed");

  const salt = Buffer.from(hexToBytes32(input.salt));
  const tokenId = interchainTokenId(caller, salt);
  const [itsRootPda] = findItsRootPda(itsProgramId);
  const [mint] = findInterchainTokenPda(itsProgramId, itsRootPda, tokenId);
  const [metadataAccount] = findMetadataPda(mint);
  const [gatewayRootPda] = findGatewayRootPda(gatewayProgramId);
  const [gasConfigPda] = findGasConfigPda(gasServiceProgramId);
  const [callContractSigningPda, signingPdaBump] =
    findCallContractSigningPda(itsProgramId);

  const destinationChainValues = Array.isArray(input.destinationChain)
    ? input.destinationChain
    : [input.destinationChain];
  const gasValues = Array.isArray(input.gasValue)
    ? input.gasValue
    : [input.gasValue];

  if (!destinationChainValues.length) {
    throw new Error("No destination chains provided");
  }

  const tx = new Transaction();
  destinationChainValues.forEach((destination, idx) => {
    const gas = gasValues[idx] ?? gasValues[0] ?? "0";
    const data = Buffer.concat([
      encodeVariantU8(10),
      Buffer.from(salt),
      encodeStringBorsh(destination),
      encodeU64LE(BigInt(gas)),
      Buffer.from([signingPdaBump]),
    ]);
    const keys = [
      { pubkey: caller, isSigner: true, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: metadataAccount, isSigner: false, isWritable: false },
      { pubkey: gatewayRootPda, isSigner: false, isWritable: false },
      { pubkey: gatewayProgramId, isSigner: false, isWritable: false },
      { pubkey: gasConfigPda, isSigner: false, isWritable: true },
      { pubkey: gasServiceProgramId, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: itsRootPda, isSigner: false, isWritable: false },
      { pubkey: callContractSigningPda, isSigner: false, isWritable: false },
      { pubkey: itsProgramId, isSigner: false, isWritable: false },
    ];
    tx.add(new TransactionInstruction({ programId: itsProgramId, keys, data }));
  });
  tx.feePayer = caller;
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  const txBase64 = tx
    .serialize({ requireAllSignatures: false, verifySignatures: false })
    .toString("base64");
  const tokenIdHex = `0x${Buffer.from(tokenId).toString("hex")}`;

  return { txBase64, tokenId: tokenIdHex, tokenAddress: mint.toBase58() };
}

export async function buildDeployRemoteCanonicalInterchainTokenTxBytes(
  ctx: Context,
  input: DeployRemoteCanonicalInterchainTokenInput
): Promise<{ txBase64: string; tokenId: string; tokenAddress: string }> {
  const chainConfig = await getSolanaChainConfig(ctx);
  const rpcUrl = chainConfig.config.rpc?.[0];
  if (!rpcUrl) throw new Error("No Solana RPC configured");

  const itsProgramId = await getItsProgramId(ctx);
  const gatewayProgramId = await getGatewayProgramId(ctx);
  const gasServiceProgramId = await getAxelarGasServiceProgramId(ctx);
  const caller = new PublicKey(input.caller);
  const connection = new Connection(rpcUrl, "confirmed");

  const mint = new PublicKey(input.tokenAddress);
  const tokenId = canonicalInterchainTokenId(mint);
  const [metadataAccount] = findMetadataPda(mint);
  const [itsRootPda] = findItsRootPda(itsProgramId);
  const [gatewayRootPda] = findGatewayRootPda(gatewayProgramId);
  const [gasConfigPda] = findGasConfigPda(gasServiceProgramId);
  const [callContractSigningPda, signingPdaBump] =
    findCallContractSigningPda(itsProgramId);

  const destinations = Array.isArray(input.destinationChain)
    ? input.destinationChain
    : [input.destinationChain];
  const gasValues = Array.isArray(input.gasValue)
    ? input.gasValue
    : [input.gasValue];

  if (!destinations.length) {
    throw new Error("No destination chains provided");
  }

  const tx = new Transaction();
  destinations.forEach((destination, idx) => {
    const gas = gasValues[idx] ?? gasValues[0] ?? "0";
    const data = Buffer.concat([
      encodeVariantU8(7),
      encodeStringBorsh(destination),
      encodeU64LE(BigInt(gas)),
      Buffer.from([signingPdaBump]),
    ]);
    const keys = [
      { pubkey: caller, isSigner: true, isWritable: true },
      { pubkey: mint, isSigner: false, isWritable: false },
      { pubkey: metadataAccount, isSigner: false, isWritable: false },
      { pubkey: gatewayRootPda, isSigner: false, isWritable: false },
      { pubkey: gatewayProgramId, isSigner: false, isWritable: false },
      { pubkey: gasConfigPda, isSigner: false, isWritable: true },
      { pubkey: gasServiceProgramId, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: itsRootPda, isSigner: false, isWritable: false },
      { pubkey: callContractSigningPda, isSigner: false, isWritable: false },
      { pubkey: itsProgramId, isSigner: false, isWritable: false },
    ];
    tx.add(new TransactionInstruction({ programId: itsProgramId, keys, data }));
  });
  tx.feePayer = caller;
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  const txBase64 = tx
    .serialize({ requireAllSignatures: false, verifySignatures: false })
    .toString("base64");
  const tokenIdHex = `0x${Buffer.from(tokenId).toString("hex")}`;

  return { txBase64, tokenId: tokenIdHex, tokenAddress: mint.toBase58() };
}

export async function buildInterchainTransferTxBytes(
  ctx: Context,
  input: InterchainTransferInput
): Promise<{ txBase64: string }> {
  const chainConfig = await getSolanaChainConfig(ctx);
  const rpcUrl = chainConfig.config.rpc?.[0];
  if (!rpcUrl) throw new Error("No Solana RPC configured");

  const itsProgramId = await getItsProgramId(ctx);
  const gatewayProgramId = await getGatewayProgramId(ctx);
  const gasServiceProgramId = await getAxelarGasServiceProgramId(ctx);

  const caller = new PublicKey(input.caller);
  const connection = new Connection(rpcUrl, "confirmed");

  const tokenIdBytes = Buffer.from(input.tokenId.replace(/^0x/, ""), "hex");
  if (tokenIdBytes.length !== 32) throw new Error("tokenId must be 32 bytes");
  const [itsRootPda] = findItsRootPda(itsProgramId);
  const [tokenManagerPda] = findTokenManagerPda(
    itsProgramId,
    itsRootPda,
    tokenIdBytes
  );
  const mint = new PublicKey(input.tokenAddress);

  // Determine token program (support TOKEN_2022 and SPL)
  const mintInfo = await connection.getAccountInfo(mint);
  if (!mintInfo) throw new Error("Mint not found");
  const tokenProgramId = mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID)
    ? TOKEN_2022_PROGRAM_ID
    : SPL_TOKEN_PROGRAM_ID;

  const sourceAccount = getAssociatedTokenAddressSync(
    mint,
    caller,
    true,
    tokenProgramId,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const tokenManagerAta = getAssociatedTokenAddressSync(
    mint,
    tokenManagerPda,
    true,
    tokenProgramId,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // Flow slot PDA requires epoch (current timestamp / 6h)
  const now = Math.floor(Date.now() / 1000);
  const epoch = Math.floor(now / (6 * 60 * 60));
  const flowEpochBuf = Buffer.alloc(8);
  flowEpochBuf.writeBigUInt64LE(BigInt(epoch));
  const [flowSlotPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("flow-slot"), tokenManagerPda.toBuffer(), flowEpochBuf],
    itsProgramId
  );

  const [gatewayRootPda] = findGatewayRootPda(gatewayProgramId);
  const [gasConfigPda] = findGasConfigPda(gasServiceProgramId);
  const [callContractSigningPda, signingPdaBump] =
    findCallContractSigningPda(itsProgramId);

  const destinationAddressBytes = Buffer.from(
    input.destinationAddress.replace(/^0x/, ""),
    "hex"
  );
  const amount = BigInt(input.amount);
  const gas = BigInt(input.gasValue ?? "0");

  const data = Buffer.concat([
    encodeVariantU8(8),
    Buffer.from(tokenIdBytes),
    encodeStringBorsh(input.destinationChain),
    encodeU32LE(destinationAddressBytes.length),
    Buffer.from(destinationAddressBytes),
    encodeU64LE(amount),
    encodeU64LE(gas),
    Buffer.from([signingPdaBump]),
  ]);

  const keys = [
    { pubkey: caller, isSigner: true, isWritable: false },
    { pubkey: sourceAccount, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: true },
    { pubkey: tokenManagerPda, isSigner: false, isWritable: false },
    { pubkey: tokenManagerAta, isSigner: false, isWritable: true },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    { pubkey: flowSlotPda, isSigner: false, isWritable: true },
    { pubkey: gatewayRootPda, isSigner: false, isWritable: false },
    { pubkey: gatewayProgramId, isSigner: false, isWritable: false },
    { pubkey: gasConfigPda, isSigner: false, isWritable: true },
    { pubkey: gasServiceProgramId, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: itsRootPda, isSigner: false, isWritable: false },
    { pubkey: callContractSigningPda, isSigner: false, isWritable: false },
    { pubkey: itsProgramId, isSigner: false, isWritable: false },
  ];

  const ix = new TransactionInstruction({
    programId: itsProgramId,
    keys,
    data,
  });
  const tx = new Transaction().add(ix);
  tx.feePayer = caller;
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  const txBase64 = tx
    .serialize({ requireAllSignatures: false, verifySignatures: false })
    .toString("base64");
  return { txBase64 };
}
