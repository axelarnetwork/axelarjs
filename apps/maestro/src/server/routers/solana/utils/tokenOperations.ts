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
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import type { Context } from "~/server/context";
import {
  canonicalInterchainTokenId,
  findCallContractSigningPda,
  findGasTreasuryPda,
  findGatewayRootPda,
  findInterchainTokenPda,
  findItsRootPda,
  findMetadataPda,
  findTokenManagerPda,
  findUserRolesPda,
  findEventAuthority,
  interchainTokenId,
  TOKEN_METADATA_PROGRAM_ID,
} from "./solanaPda";
import {
  DeployInterchainTokenInput,
  RegisterCanonicalInterchainTokenInput,
  type DeployRemoteCanonicalInterchainTokenInput,
  type DeployRemoteInterchainTokenInput,
  type InterchainTransferInput,
  type MintInterchainTokenInput,
} from "./types";
import {
  anchorInstructionDiscriminator,
  encodeStringBorsh,
  encodeU32LE,
  encodeU64LE,
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

  const DEPLOY_INTERCHAIN_TOKEN_INSTRUCTION_ID = await anchorInstructionDiscriminator("deploy_interchain_token");
  const REGISTER_CANONICAL_INTERCHAIN_TOKEN_INSTRUCTION_ID = await anchorInstructionDiscriminator("register_canonical_interchain_token");
  const DEPLOY_REMOTE_INTERCHAIN_TOKEN_INSTRUCTION_ID = await anchorInstructionDiscriminator("deploy_remote_interchain_token");
  const DEPLOY_REMOTE_CANONICAL_INTERCHAIN_TOKEN_INSTRUCTION_ID = await anchorInstructionDiscriminator("deploy_remote_canonical_interchain_token");
  const INTERCHAIN_TRANSFER_INSTRUCTION_ID = await anchorInstructionDiscriminator("interchain_transfer");
  const MINT_INTERCHAIN_TOKEN_INSTRUCTION_ID = await anchorInstructionDiscriminator("mint_interchain_token");

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
  const payer = new PublicKey(input.caller);
  const connection = new Connection(rpcUrl, "confirmed");

  const salt = Buffer.from(hexToBytes32(input.salt));
  const tokenId = interchainTokenId(payer, salt);
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
    payer,
    true,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const [metadataAccount] = findMetadataPda(mint);
  const minter = input.minterAddress
    ? new PublicKey(input.minterAddress)
    : null;
  const optionalMinterRolesPda = minter
    ? findUserRolesPda(itsProgramId, tokenManagerPda, minter)[0]
    : undefined;
  const [itsEventAuthority] = findEventAuthority(itsProgramId);

  // Borsh encoding: Anchor discriminator + salt + name + symbol + decimals + initial_supply
  const data = Buffer.concat([
    DEPLOY_INTERCHAIN_TOKEN_INSTRUCTION_ID,
    salt, // [u8; 32]
    encodeStringBorsh(input.tokenName),
    encodeStringBorsh(input.tokenSymbol),
    Buffer.from([input.decimals]),
    encodeU64LE(new BN(input.initialSupply).toString()),
  ]);

  const keys = [
    // 0. [writable, signer] payer
    { pubkey: payer, isSigner: true, isWritable: true },
    // 1. [signer] deployer (use payer as deployer)
    { pubkey: payer, isSigner: true, isWritable: false },
    // 2. [] system_program
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    // 3. [] its_root_pda
    { pubkey: itsRootPda, isSigner: false, isWritable: false },
    // 4. [writable] token_manager_pda
    { pubkey: tokenManagerPda, isSigner: false, isWritable: true },
    // 5. [writable] token_mint
    { pubkey: mint, isSigner: false, isWritable: true },
    // 6. [writable] token_manager_ata
    { pubkey: tokenManagerAta, isSigner: false, isWritable: true },
    // 7. [] token_program (Token2022)
    { pubkey: TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false },
    // 8. [] associated_token_program
    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    // 9. [] sysvar_instructions
    { pubkey: SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false },
    // 10. [] mpl_token_metadata_program
    { pubkey: TOKEN_METADATA_PROGRAM_ID, isSigner: false, isWritable: false },
    // 11. [writable] mpl_token_metadata_account
    { pubkey: metadataAccount, isSigner: false, isWritable: true },
    // 12. [writable] deployer_ata (payer's ATA)
    { pubkey: payerAta, isSigner: false, isWritable: true },
  ];

  if (minter && optionalMinterRolesPda) {
    // 13. [] minter
    keys.push({ pubkey: minter, isSigner: false, isWritable: false });
    // 14. [writable] minter_roles_pda
    keys.push({
      pubkey: optionalMinterRolesPda,
      isSigner: false,
      isWritable: true,
    });
  }

  // 15. [] event_authority
  keys.push({
    pubkey: itsEventAuthority,
    isSigner: false,
    isWritable: false,
  });
  // 16. [] program (ITS program id)
  keys.push({
    pubkey: itsProgramId,
    isSigner: false,
    isWritable: false,
  });

  const ix = new TransactionInstruction({
    programId: itsProgramId,
    keys,
    data,
  });

  const tx = new Transaction().add(ix);
  tx.feePayer = payer;
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
  const payer = new PublicKey(input.caller);
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
  const [itsEventAuthority] = findEventAuthority(itsProgramId);

  const data = Buffer.concat([
    REGISTER_CANONICAL_INTERCHAIN_TOKEN_INSTRUCTION_ID
  ]);

  const keys = [
    // 0. [writable, signer] payer
    { pubkey: payer, isSigner: true, isWritable: true },
    // 1. [] metadata_account
    { pubkey: metadataAccount, isSigner: false, isWritable: false },
    // 2. [] system_program
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    // 3. [] its_root_pda
    { pubkey: itsRootPda, isSigner: false, isWritable: false },
    // 4. [writable] token_manager_pda
    { pubkey: tokenManagerPda, isSigner: false, isWritable: true },
    // 5. [] token_mint
    { pubkey: mint, isSigner: false, isWritable: false },
    // 6. [writable] token_manager_ata
    { pubkey: tokenManagerAta, isSigner: false, isWritable: true },
    // 7. [] token_program
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    // 8. [] associated_token_program
    { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    // 9. [] event_authority
    { pubkey: itsEventAuthority, isSigner: false, isWritable: false },
    // 10. [] program (ITS program id)
    { pubkey: itsProgramId, isSigner: false, isWritable: false },
  ];

  const ix = new TransactionInstruction({
    programId: itsProgramId,
    keys,
    data,
  });

  const tx = new Transaction().add(ix);
  tx.feePayer = payer;
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
  const payer = new PublicKey(input.caller);
  const connection = new Connection(rpcUrl, "confirmed");

  const salt = Buffer.from(hexToBytes32(input.salt));
  const tokenId = interchainTokenId(payer, salt);
  const [itsRootPda] = findItsRootPda(itsProgramId);
  const [tokenManagerPda] = findTokenManagerPda(
    itsProgramId,
    itsRootPda,
    tokenId
  );
  const [mint] = findInterchainTokenPda(itsProgramId, itsRootPda, tokenId);
  const [metadataAccount] = findMetadataPda(mint);
  const [gatewayRootPda] = findGatewayRootPda(gatewayProgramId);
  const [callContractSigningPda, ] =
    findCallContractSigningPda(itsProgramId);
  const [gatewayEventAuthority] = findEventAuthority(gatewayProgramId);
  const [gasTreasury] = findGasTreasuryPda(gasServiceProgramId);
  const [gasEventAuthority] = findEventAuthority(gasServiceProgramId);
  const [itsEventAuthority] = findEventAuthority(itsProgramId);

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
      DEPLOY_REMOTE_INTERCHAIN_TOKEN_INSTRUCTION_ID,
      Buffer.from(salt),
      encodeStringBorsh(destination),
      encodeU64LE(BigInt(gas)),
    ]);
    const keys = [
      // 0. [writable, signer] payer
      { pubkey: payer, isSigner: true, isWritable: true },
      // 1. [signer] deployer (use payer as deployer)
      { pubkey: payer, isSigner: true, isWritable: false },
      // 2. [] token_mint
      { pubkey: mint, isSigner: false, isWritable: false },
      // 3. [] metadata_account
      { pubkey: metadataAccount, isSigner: false, isWritable: false },
      // 4. [writable] token_manager_pda
      { pubkey: tokenManagerPda, isSigner: false, isWritable: true },
      // 5. [] gateway_root_pda
      { pubkey: gatewayRootPda, isSigner: false, isWritable: false },
      // 6. [] gateway_program
      { pubkey: gatewayProgramId, isSigner: false, isWritable: false },
      // 7. [] system_program
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      // 8. [] its_root_pda
      { pubkey: itsRootPda, isSigner: false, isWritable: false },
      // 9. [] call_contract_signing_pda
      { pubkey: callContractSigningPda, isSigner: false, isWritable: false },
      // 10. [] gateway_event_authority
      { pubkey: gatewayEventAuthority, isSigner: false, isWritable: false },
      // 11. [writable] gas_treasury
      { pubkey: gasTreasury, isSigner: false, isWritable: true },
      // 12. [] gas_service
      { pubkey: gasServiceProgramId, isSigner: false, isWritable: false },
      // 13. [] gas_event_authority
      { pubkey: gasEventAuthority, isSigner: false, isWritable: false },
      // 14. [] event_authority (ITS)
      { pubkey: itsEventAuthority, isSigner: false, isWritable: false },
      // 15. [] program (ITS program id)
      { pubkey: itsProgramId, isSigner: false, isWritable: false },
    ];
    tx.add(new TransactionInstruction({ programId: itsProgramId, keys, data }));
  });
  tx.feePayer = payer;
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
  const payer = new PublicKey(input.caller);
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
  const [gatewayRootPda] = findGatewayRootPda(gatewayProgramId);
  const [callContractSigningPda, ] = findCallContractSigningPda(itsProgramId);
  const [gatewayEventAuthority] = findEventAuthority(gatewayProgramId);
  const [gasTreasury] = findGasTreasuryPda(gasServiceProgramId);
  const [gasEventAuthority] = findEventAuthority(gasServiceProgramId);
  const [itsEventAuthority] = findEventAuthority(itsProgramId);

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
      DEPLOY_REMOTE_CANONICAL_INTERCHAIN_TOKEN_INSTRUCTION_ID,
      encodeStringBorsh(destination),
      encodeU64LE(BigInt(gas)),
    ]);
    const keys = [
      // 0. [writable, signer] payer
      { pubkey: payer, isSigner: true, isWritable: true },
      // 1. [] token_mint
      { pubkey: mint, isSigner: false, isWritable: false },
      // 2. [] metadata_account
      { pubkey: metadataAccount, isSigner: false, isWritable: false },
      // 3. [writable] token_manager_pda
      { pubkey: tokenManagerPda, isSigner: false, isWritable: true },
      // 4. [] gateway_root_pda
      { pubkey: gatewayRootPda, isSigner: false, isWritable: false },
      // 5. [] gateway_program
      { pubkey: gatewayProgramId, isSigner: false, isWritable: false },
      // 6. [] system_program
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      // 7. [] its_root_pda
      { pubkey: itsRootPda, isSigner: false, isWritable: false },
      // 8. [] call_contract_signing_pda
      { pubkey: callContractSigningPda, isSigner: false, isWritable: false },
      // 9. [] gateway_event_authority
      { pubkey: gatewayEventAuthority, isSigner: false, isWritable: false },
      // 10. [writable] gas_treasury
      { pubkey: gasTreasury, isSigner: false, isWritable: true },
      // 11. [] gas_service
      { pubkey: gasServiceProgramId, isSigner: false, isWritable: false },
      // 12. [] gas_event_authority
      { pubkey: gasEventAuthority, isSigner: false, isWritable: false },
      // 13. [] event_authority (ITS)
      { pubkey: itsEventAuthority, isSigner: false, isWritable: false },
      // 14. [] program (ITS program id)
      { pubkey: itsProgramId, isSigner: false, isWritable: false },
    ];
    tx.add(new TransactionInstruction({ programId: itsProgramId, keys, data }));
  });
  tx.feePayer = payer;
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

  const payer = new PublicKey(input.caller);
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

  // Caller is both payer and authority for direct user transfers
  const authority = payer;
  const tokenManagerAta = getAssociatedTokenAddressSync(
    mint,
    tokenManagerPda,
    true,
    tokenProgramId,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const authorityTokenAccount = getAssociatedTokenAddressSync(
    mint,
    authority,
    true,
    tokenProgramId,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // Flow slot PDA requires epoch (current timestamp / 6h)
  const now = Math.floor(Date.now() / 1000);
  const epoch = Math.floor(now / (6 * 60 * 60));
  const flowEpochBuf = Buffer.alloc(8);
  flowEpochBuf.writeBigUInt64LE(BigInt(epoch));

  const [gatewayRootPda] = findGatewayRootPda(gatewayProgramId);
  const [callContractSigningPda, ] =
    findCallContractSigningPda(itsProgramId);
  const [gatewayEventAuthority] = findEventAuthority(gatewayProgramId);
  const [gasEventAuthority] = findEventAuthority(gasServiceProgramId);
  const [itsEventAuthority] = findEventAuthority(itsProgramId);
  const [gasTreasury] = findGasTreasuryPda(gasServiceProgramId);
  

  const destinationAddressBytes = Buffer.from(
    input.destinationAddress.replace(/^0x/, ""),
    "hex"
  );
  const amount = BigInt(input.amount);
  const gas = BigInt(input.gasValue ?? "0");

  const data = Buffer.concat([
    // instruction id
    INTERCHAIN_TRANSFER_INSTRUCTION_ID,
    // token_id
    Buffer.from(tokenIdBytes),
    // destination_chain
    encodeStringBorsh(input.destinationChain),
    // destination_address
    encodeU32LE(destinationAddressBytes.length),
    Buffer.from(destinationAddressBytes),
    // amount
    encodeU64LE(amount),
    // gas_value
    encodeU64LE(gas),
    // caller_program_id: Option<Pubkey> = None
    // caller_pda_seeds: Option<Vec<Vec<u8>>> = None
    // data: Option<Vec<u8>> = None
    Buffer.from([0, 0, 0]),
  ]);

  const keys = [
    // 0. [writable, signer] payer
    { pubkey: payer, isSigner: true, isWritable: true },
    // 1. [signer] authority
    { pubkey: authority, isSigner: true, isWritable: false },
    // 2. [] gateway_root_pda
    { pubkey: gatewayRootPda, isSigner: false, isWritable: false },
    // 3. [] gateway_event_authority
    { pubkey: gatewayEventAuthority, isSigner: false, isWritable: false },
    // 4. [] gateway_program
    { pubkey: gatewayProgramId, isSigner: false, isWritable: false },
    // 5. [] call_contract_signing_pda
    { pubkey: callContractSigningPda, isSigner: false, isWritable: false },
    // 6. [writable] gas_treasury
    { pubkey: gasTreasury, isSigner: false, isWritable: true },
    // 7. [] gas_service
    { pubkey: gasServiceProgramId, isSigner: false, isWritable: false },
    // 8. [] gas_event_authority
    { pubkey: gasEventAuthority, isSigner: false, isWritable: false },
    // 9. [] its_root_pda
    { pubkey: itsRootPda, isSigner: false, isWritable: false },
    // 10. [writable] token_manager_pda
    { pubkey: tokenManagerPda, isSigner: false, isWritable: true },
    // 11. [] token_program
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    // 12. [writable] token_mint
    { pubkey: mint, isSigner: false, isWritable: true },
    // 13. [writable] authority_token_account
    { pubkey: authorityTokenAccount, isSigner: false, isWritable: true },
    // 14. [writable] token_manager_ata
    { pubkey: tokenManagerAta, isSigner: false, isWritable: true },
    // 15. [] system_program
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    // 16. [] event_authority (ITS)
    { pubkey: itsEventAuthority, isSigner: false, isWritable: false },
    // 17. [] program (ITS program id)
    { pubkey: itsProgramId, isSigner: false, isWritable: false },
  ];

  const ix = new TransactionInstruction({
    programId: itsProgramId,
    keys,
    data,
  });
  const tx = new Transaction().add(ix);
  tx.feePayer = payer;
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  const txBase64 = tx
    .serialize({ requireAllSignatures: false, verifySignatures: false })
    .toString("base64");
  return { txBase64 };
}

export async function buildMintInterchainTokenTxBytes(
  ctx: Context,
  input: MintInterchainTokenInput
): Promise<{ txBase64: string }> {
  const chainConfig = await getSolanaChainConfig(ctx);
  const rpcUrl = chainConfig.config.rpc?.[0];
  if (!rpcUrl) throw new Error("No Solana RPC configured");

  const itsProgramId = await getItsProgramId(ctx);
  const payer = new PublicKey(input.caller);
  const minter = payer;
  const connection = new Connection(rpcUrl, "confirmed");

  const tokenIdBytes = Buffer.from(input.tokenId.replace(/^0x/, ""), "hex");
  if (tokenIdBytes.length !== 32) {
    throw new Error("tokenId must be 32 bytes");
  }

  const [itsRootPda] = findItsRootPda(itsProgramId);
  const [tokenManagerPda] = findTokenManagerPda(
    itsProgramId,
    itsRootPda,
    tokenIdBytes
  );
  const [mint] = findInterchainTokenPda(itsProgramId, itsRootPda, tokenIdBytes);

  // Determine token program (support TOKEN_2022 and SPL)
  const mintInfo = await connection.getAccountInfo(mint);
  if (!mintInfo) throw new Error("Mint not found");
  const tokenProgramId = mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID)
    ? TOKEN_2022_PROGRAM_ID
    : SPL_TOKEN_PROGRAM_ID;

  const destinationAccount = getAssociatedTokenAddressSync(
    mint,
    minter,
    true,
    tokenProgramId,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const [minterRolesPda] = findUserRolesPda(
    itsProgramId,
    tokenManagerPda,
    minter
  );

  const amount = BigInt(input.amount);

  const data = Buffer.concat([
    // instruction discriminator
    MINT_INTERCHAIN_TOKEN_INSTRUCTION_ID,
    // amount: u64
    encodeU64LE(amount),
  ]);

  const keys = [
    // 0. [writable] mint
    { pubkey: mint, isSigner: false, isWritable: true },
    // 1. [writable] destination_account
    { pubkey: destinationAccount, isSigner: false, isWritable: true },
    // 2. [] its_root_pda
    { pubkey: itsRootPda, isSigner: false, isWritable: false },
    // 3. [writable] token_manager_pda
    { pubkey: tokenManagerPda, isSigner: false, isWritable: true },
    // 4. [signer] minter
    { pubkey: minter, isSigner: true, isWritable: false },
    // 5. [] minter_roles_pda
    { pubkey: minterRolesPda, isSigner: false, isWritable: false },
    // 6. [] token_program
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
  ];

  const ix = new TransactionInstruction({
    programId: itsProgramId,
    keys,
    data,
  });
  const tx = new Transaction().add(ix);
  tx.feePayer = payer;
  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  const txBase64 = tx
    .serialize({ requireAllSignatures: false, verifySignatures: false })
    .toString("base64");
  return { txBase64 };
}
