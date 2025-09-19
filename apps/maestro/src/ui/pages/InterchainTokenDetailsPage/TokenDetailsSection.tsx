import {
  Alert,
  Badge,
  Button,
  cn,
  CopyToClipboardButton,
  Edit2Icon,
  ExternalLinkIcon,
  FormControl,
  Indicator,
  InfoIcon,
  Label,
  LinkButton,
  Modal,
  TextInput,
  Tooltip,
  useIsElementInViewport,
} from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { maskAddress, Maybe } from "@axelarjs/utils";
import { useMemo, useRef, useState, type FC, type ReactNode } from "react";
import Identicon, { jsNumberForAddress } from "react-jazzicon";
import Image from "next/image";

import { createWalletClient, custom, type Chain } from "viem";
import { watchAsset } from "viem/actions";
import { z } from "zod";

import { useHederaTokenAssociation } from "~/features/hederaHooks";
import {
  HEDERA_CHAIN_ID,
  STELLAR_CHAIN_ID,
  SUI_CHAIN_ID,
  useAccount,
} from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import { hex64Literal } from "~/lib/utils/validation";
import { ITSChainConfig } from "~/server/chainConfig";
import { ChainIcon } from "~/ui/components/ChainsDropdown";

type UseHederaAssociationArgs = {
  tokenAddress: string | undefined;
  connectedChain: Chain | undefined;
  connectedAddress: string | undefined;
  hasWallet: boolean;
};

function useHederaAssociation({
  tokenAddress,
  connectedChain,
  connectedAddress,
  hasWallet,
}: UseHederaAssociationArgs) {
  const {
    isAssociated,
    isCheckingAssociation,
    invalidateAssociation,
    associateHederaToken,
    dissociateHederaToken,
    hasAssociationError,
  } = useHederaTokenAssociation(tokenAddress as `0x${string}`);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onAssociate = async () => {
    if (!tokenAddress || !hasWallet || !connectedAddress) return;
    let loadingToastId: string | undefined;
    try {
      setIsSubmitting(true);
      loadingToastId = toast.loading("Associating with token");
      const txHash = await associateHederaToken(tokenAddress as `0x${string}`);
      if (loadingToastId) toast.dismiss(loadingToastId);
      const baseUrl = connectedChain?.blockExplorers?.default.url;
      const txUrl = baseUrl ? `${baseUrl}/tx/${txHash}` : undefined;
      toast.success(
        txUrl ? (
          <span>
            Associated with token. Transaction hash:
            <a
              href={txUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline"
            >
              {txHash}
            </a>
          </span>
        ) : (
          "Associated with token. Transaction hash: " + txHash
        ),
        { duration: 10000 }
      );
      await invalidateAssociation();
    } catch (error) {
      console.error(error);
      if (loadingToastId) toast.dismiss(loadingToastId);
      toast.error(
        error instanceof Error ? error.message : "Association failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDissociate = async () => {
    if (!tokenAddress || !hasWallet || !connectedAddress) return;
    let loadingToastId: string | undefined;
    try {
      setIsSubmitting(true);
      loadingToastId = toast.loading("Dissociating from token");
      const txHash = await dissociateHederaToken(tokenAddress as `0x${string}`);
      if (loadingToastId) toast.dismiss(loadingToastId);
      const baseUrl = connectedChain?.blockExplorers?.default.url;
      const txUrl = baseUrl ? `${baseUrl}/tx/${txHash}` : undefined;
      toast.success(
        txUrl ? (
          <span>
            Dissociated from token. Transaction hash:
            <a
              href={txUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline"
            >
              {txHash}
            </a>
          </span>
        ) : (
          "Dissociated from token. Transaction hash: " + txHash
        ),
        { duration: 10000 }
      );
      await invalidateAssociation();
    } catch (error) {
      console.error(error);
      if (loadingToastId) toast.dismiss(loadingToastId);
      toast.error(
        error instanceof Error ? error.message : "Dissociation failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isAssociated,
    isCheckingAssociation,
    hasAssociationError,
    isSubmitting,
    onAssociate,
    onDissociate,
  } as const;
}

export type TokenDetailsSectionProps = {
  name: string;
  symbol: string;
  chain: ITSChainConfig;
  tokenAddress: string;
  wasDeployedByAccount?: boolean;
  decimals: number;
  tokenId?: `0x${string}` | null | undefined;
  deploymentMessageId?: string | undefined;
  tokenManagerAddress?: string | null;
  kind?: "canonical" | "interchain" | "custom";
  claimOwnershipFormLink?: string;
};

const TokenDetailsSection: FC<TokenDetailsSectionProps> = (props) => {
  let wallet = null;
  if (typeof window !== "undefined" && (window as any).ethereum) {
    wallet = createWalletClient({
      transport: custom((window as any).ethereum),
    });
  }

  const { data: meta } = trpc.interchainToken.getInterchainTokenMeta.useQuery(
    {
      tokenId: props.tokenId!,
    },
    {
      enabled: !!props.tokenId,
    }
  );

  const isSuiChain = props.chain.chain_id === SUI_CHAIN_ID;
  const isStellarChain = props.chain.chain_id === STELLAR_CHAIN_ID;
  const isHederaChain = props.chain.chain_id === HEDERA_CHAIN_ID;
  const tokenAddress = props.tokenAddress;

  const { address: connectedAddress, chain: connectedChain } = useAccount();
  const {
    isAssociated,
    isCheckingAssociation,
    hasAssociationError,
    isSubmitting,
    onAssociate,
    onDissociate,
  } = useHederaAssociation({
    tokenAddress,
    connectedChain,
    connectedAddress,
    hasWallet: Boolean(wallet),
  });

  const tokenDetails: Array<[string, ReactNode]> = [
    ["Name", props.name],
    ["Symbol", props.symbol],
    ["Decimals", props.decimals],
    [
      "Token Address",
      <CopyToClipboardButton
        key="token-address"
        $size="sm"
        $variant="ghost"
        copyText={tokenAddress}
      >
        {maskAddress(tokenAddress)}
      </CopyToClipboardButton>,
    ],
  ];

  if (connectedAddress && wallet && isHederaChain) {
    tokenDetails.push([
      "Hedera Token Association",
      <div key="hedera-assoc" className="flex items-center gap-2">
        {hasAssociationError && !isCheckingAssociation && (
          <span className="text-warning">
            Error checking association. Make sure your wallet address belongs to
            a Hedera account.
          </span>
        )}
        {!hasAssociationError && isCheckingAssociation && (
          <span>Checking token association...</span>
        )}
        {!hasAssociationError &&
          !isCheckingAssociation &&
          isAssociated !== null && (
            <span>
              {isAssociated ? (
                <span className="text-lg leading-none text-success">
                  ✓ Associated
                </span>
              ) : (
                <span className="text-lg leading-none text-error">
                  x Not associated
                </span>
              )}
              <Button
                key="assoc-action"
                className="ml-[-10px]"
                $variant="link"
                $loading={isSubmitting}
                aria-disabled={isSubmitting}
                tabIndex={isSubmitting ? -1 : 0}
                onClick={async (e) => {
                  e.preventDefault();
                  if (isSubmitting) return;
                  if (isAssociated) await onDissociate();
                  else await onAssociate();
                }}
              >
                {isAssociated ? "Disassociate" : "Associate"}
              </Button>
            </span>
          )}
      </div>,
    ]);
  }

  if (wallet && !isSuiChain && !isStellarChain && !isHederaChain) {
    tokenDetails.push([
      "Add Token to Wallet",
      <LinkButton
        key="add-to-wallet"
        href="#"
        className="ml-[-10px]"
        $variant="link"
        onClick={async () => {
          try {
            await watchAsset(wallet, {
              type: "ERC20",
              options: {
                address: props.tokenAddress,
                decimals: props.decimals,
                symbol: props.symbol,
                image: meta?.iconUrl,
              },
            });
          } catch (_e) {
            // noop because the error is raised when the user cancels the popup dialog
          }
        }}
      >
        Add
      </LinkButton>,
    ]);
  }

  if (props.deploymentMessageId) {
    if (props.tokenManagerAddress) {
      tokenDetails.push([
        "Token Manager",
        <CopyToClipboardButton
          key="token-manager"
          $size="sm"
          $variant="ghost"
          copyText={props.tokenManagerAddress}
        >
          {maskAddress(props.tokenManagerAddress)}
        </CopyToClipboardButton>,
      ]);
    }

    if (props.tokenId) {
      tokenDetails.push([
        "Token ID",
        <div key="token-id" className="flex items-center">
          <CopyToClipboardButton
            $size="sm"
            $variant="ghost"
            copyText={props.tokenId}
          >
            {maskAddress(props.tokenId)}
          </CopyToClipboardButton>
          <Tooltip
            tip="TokenId is a common key used to identify an interchain token across all chains"
            $variant="primary"
            $position="bottom"
          >
            <InfoIcon className="h-[1em] w-[1em] text-primary" />
          </Tooltip>
        </div>,
      ]);

      if (props.wasDeployedByAccount && props.claimOwnershipFormLink) {
        tokenDetails.push([
          "Token Ownership Claim Request",
          <LinkButton
            key="token-ownership-claim"
            target="_blank"
            className="ml-[-10px]"
            $variant="link"
            href={props.claimOwnershipFormLink}
          >
            Link
          </LinkButton>,
        ]);
      }

      if (props.wasDeployedByAccount) {
        tokenDetails.push([
          "Add Your Token on Squid",
          <div key="add-token-squid" className="flex items-center">
            <LinkButton
              target="_blank"
              className="ml-[-10px]"
              $variant="link"
              href="https://github.com/axelarnetwork/axelar-configs "
            >
              Link
            </LinkButton>
            <Tooltip
              $as={Indicator}
              $variant="primary"
              $position="right"
              tip="Squid is a platform that allows any token to be swapped between blockchains, and unlocks access to apps across chains in a single click. Create a PR there to request your token to be listed on Squid"
            >
              <InfoIcon className="h-[1em] w-[1em] text-primary" />
            </Tooltip>
          </div>,
        ]);
      }
    }

    if (props.wasDeployedByAccount) {
      tokenDetails.push([
        "Apply for coordinated marketing with Axelar",
        <div key="apply-coordinated-marketing" className="flex items-center">
          <LinkButton
            target="_blank"
            className="ml-[-10px]"
            $variant="link"
            href="https://haz8ao8c4f2.typeform.com/to/pqm6CTC3"
          >
            Link
          </LinkButton>
          <Tooltip
            tip="If you want to jointly market your newly created token with us, reach out to us via this form, and we will reach out"
            $variant="primary"
            $position="bottom"
          >
            <InfoIcon className="h-[1em] w-[1em] text-primary" />
          </Tooltip>
        </div>,
      ]);
    }
  }

  const sanitizedTokenDetails = tokenDetails.filter(([, value]) =>
    Boolean(value)
  );

  function getTokenExplorerLink() {
    const explorer = props.chain.blockExplorers?.[0];

    if (isSuiChain) {
      return `${explorer?.url}/coin/${props.tokenAddress}`;
    } else if (props.chain.chain_type.includes("stellar")) {
      return `${explorer?.url}/coin/${props.tokenAddress}`;
    } else if (props.chain.id.includes("stellar")) {
      if (props.tokenAddress.includes("-")) {
        return `${explorer?.url}/asset/${props.tokenAddress}`;
      } else {
        return `${explorer?.url}/contract/${props.tokenAddress}`;
      }
    } else {
      return `${explorer?.url}/token/${props.tokenAddress}`;
    }
  }

  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 text-2xl font-semibold md:gap-3">
          {props.tokenId && props.deploymentMessageId && (
            <ManageTokenIcon
              tokenId={props.tokenId}
              wasDeployedByAccount={props.wasDeployedByAccount}
            />
          )}

          {Boolean(props.name && props.symbol) && (
            <div className="grid -space-y-1">
              <span className="text-lg text-primary">{props.symbol}</span>{" "}
              <span className="text-base opacity-50">{props.name}</span>
            </div>
          )}
        </div>
        <LinkButton
          className="flex items-center gap-2 text-lg"
          href={getTokenExplorerLink()}
          target="_blank"
          rel="noopener noreferrer"
          $size="sm"
        >
          <ChainIcon src={props.chain.image} alt={props.chain.name} size="md" />
          <span>View token</span>
          <span className="hidden sm:ml-[-4px] sm:block">
            on {props.chain.blockExplorers?.[0].name}
          </span>
          <ExternalLinkIcon className="h-4 w-4 translate-x-1" />
        </LinkButton>
      </div>

      {props.deploymentMessageId && props.kind === "canonical" && (
        <div className="italic">
          This is a pre-existing token on {props.chain.name} that was registered
          on ITS, powered by Axelar
        </div>
      )}
      <ul className="grid gap-1.5">
        {sanitizedTokenDetails.map(([label, value]) => (
          <li
            key={String(label)}
            className="md:text-md flex h-8 items-center gap-2 text-sm lg:text-lg"
          >
            <span className="font-semibold">{label}: </span>
            <span className="opacity-60">{value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TokenDetailsSection;

type ManageTokenIconProps = {
  tokenId: `0x${string}`;
  wasDeployedByAccount?: boolean;
};

const ManageTokenIcon: FC<ManageTokenIconProps> = ({
  tokenId,
  wasDeployedByAccount,
}) => {
  const { data: meta, refetch } =
    trpc.interchainToken.getInterchainTokenMeta.useQuery({
      tokenId,
    });
  const { address } = useAccount();

  const { data: roles } =
    trpc.interchainToken.getInterchainTokenRolesForAccount.useQuery(
      {
        tokenId,
        accountAddress: address,
      },
      {
        enabled: Boolean(address),
      }
    );

  const isOperator = roles?.tokenManager?.includes("OPERATOR");

  const icon = <TokenIcon tokenId={tokenId} />;

  if (!isOperator && !wasDeployedByAccount) {
    return icon;
  }

  return (
    <UpdateTokenIcon
      tokenId={tokenId}
      onUpdated={refetch}
      existingIconUrl={meta?.iconUrl}
      icon={icon}
    />
  );
};

export const TokenIcon: FC<{ tokenId: `0x${string}` }> = ({ tokenId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInViewport = useIsElementInViewport(containerRef);
  const { data: meta, isLoading } =
    trpc.interchainToken.getInterchainTokenMeta.useQuery(
      {
        tokenId,
      },
      {
        enabled: isInViewport && hex64Literal().safeParse(tokenId).success,
      }
    );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative grid h-9 w-9 place-items-start overflow-hidden rounded-full ring-2 ring-primary/50 ring-offset-2 ring-offset-base-100",
        {
          "animate-pulse": isLoading,
        }
      )}
    >
      {meta?.iconUrl ? (
        <Image
          src={`/api/avatar?tokenId=${tokenId}`}
          alt="token icon"
          layout="fill"
        />
      ) : (
        tokenId && (
          <Identicon seed={jsNumberForAddress(tokenId)} diameter={36} />
        )
      )}
    </div>
  );
};

type UpdateTokenIconProps = {
  tokenId: `0x${string}`;
  existingIconUrl?: string;
  onUpdated?: () => void;
  icon?: JSX.Element;
};

const VALID_IMAGE_FORMATS = [".png", ".jpg", ".webp"];

const UpdateTokenIcon: FC<UpdateTokenIconProps> = ({
  tokenId,
  existingIconUrl,
  icon,
  onUpdated,
}) => {
  const [iconUrl, setIconUrl] = useState(() => existingIconUrl);

  const [invalidatedImageUrls, setInvalidatedImageUrls] = useState<{
    [url: string]: string;
  }>({});

  const { mutate, isPending, error, reset } =
    trpc.interchainToken.setInterchainTokenIconUrl.useMutation({
      onError(error) {
        toast.error("Failed to save token icon");

        if (iconUrl) {
          setInvalidatedImageUrls((prev) => ({
            ...prev,
            [iconUrl]: error.message || "Failed to save token icon",
          }));
        }
      },
      onSuccess() {
        toast.success("Token icon saved");
        onUpdated?.();
        reset();
      },
    });

  const formValidationMessage = useMemo(() => {
    if (!iconUrl) {
      return "Please provide a valid URL";
    }

    if (!iconUrl.startsWith("https://")) {
      return "URL must be secure (https)";
    }

    if (!z.string().url().safeParse(iconUrl).success) {
      return "URL is not valid";
    }

    if (VALID_IMAGE_FORMATS.every((ext) => !iconUrl.endsWith(ext))) {
      return (
        <>
          URL must end with <Badge $variant="neutral">.png</Badge>,{" "}
          <Badge $variant="neutral">.jpg</Badge>, or{" "}
          <Badge $variant="neutral">.webp</Badge>
        </>
      );
    }

    if (iconUrl in invalidatedImageUrls) {
      return invalidatedImageUrls[iconUrl];
    }

    return null;
  }, [iconUrl, invalidatedImageUrls]);

  const isReadyForPreview =
    Boolean(iconUrl) && iconUrl !== existingIconUrl && !formValidationMessage;

  const sanitizedUrl = Maybe.of(iconUrl).mapOr("", (url) => {
    try {
      return new URL(url).href;
    } catch (error) {
      return "";
    }
  });

  return (
    <Tooltip $as={Indicator} $position="bottom" tip="Update token icon">
      {!existingIconUrl && (
        <Indicator.Item
          $as={Badge}
          $variant="accent"
          $size="xs"
          className="animate-pulse"
          $position="start"
        />
      )}
      <Modal
        trigger={
          <button className="group relative grid h-9 w-9 place-items-center">
            <div className="transition-opacity group-hover:opacity-50">
              {icon}
            </div>
            <Edit2Icon className="absolute h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        }
      >
        <Modal.Title>Update token icon</Modal.Title>
        <Modal.Body>
          <FormControl>
            <Label className="flex items-center justify-start gap-2">
              Token Icon URL{" "}
              <Tooltip
                tip="Provide a URL to an image to use as the token icon"
                $position="right"
              >
                <InfoIcon className="h-[1em] text-primary" />
              </Tooltip>
            </Label>

            <TextInput
              defaultValue={sanitizedUrl}
              className="bg-base-200"
              placeholder="Enter a url for a valid png, jpg, or svg icon"
              readOnly={isPending}
              onChange={(e) => {
                reset();
                setIconUrl(e.target.value);
              }}
            />
            <span className="mt-4 flex">
              <p>
                The uploaded image will only be displayed on this Interchain
                Token Service Portal, but will not carry through to any external
                services
              </p>
            </span>
          </FormControl>
          {isReadyForPreview && (
            <div className="grid place-items-center gap-4 p-4">
              <div>Icon preview</div>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sanitizedUrl}
                  alt="token icon"
                  className="size-14 rounded-full"
                />
              </div>
              <div>Does this look good?</div>
            </div>
          )}
        </Modal.Body>
        <Modal.Actions className="">
          {formValidationMessage ? (
            <Alert $status="error">{formValidationMessage}</Alert>
          ) : (
            <Button
              $length="block"
              $variant="primary"
              $loading={isPending}
              disabled={Boolean(formValidationMessage) || Boolean(error)}
              onClick={() => {
                if (iconUrl) {
                  mutate({ iconUrl, tokenId });
                }
              }}
            >
              Save icon url
            </Button>
          )}
        </Modal.Actions>
      </Modal>
    </Tooltip>
  );
};
