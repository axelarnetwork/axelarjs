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
} from "./types";
import {
  encodeStringBorsh,
  encodeU64LE,
  encodeVariantU8,
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
