import type { EVMChainConfig, VMChainConfig } from "@axelarjs/api";
import {
    Alert,
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
import { useMemo, useRef, useState, type FC } from "react";
import Identicon, { jsNumberForAddress } from "react-jazzicon";
import Image from "next/image";

import { createWalletClient, custom } from "viem";
import { watchAsset } from "viem/actions";
import { z } from "zod";

import { SUI_CHAIN_ID, useAccount } from "~/lib/hooks";
import { trpc } from "~/lib/trpc";
import { hex64Literal, isValidSuiTokenAddress } from "~/lib/utils/validation";
import { ChainIcon } from "~/ui/components/ChainsDropdown";

export type TokenDetailsSectionProps = {
  name: string;
  symbol: string;
  chain: EVMChainConfig | VMChainConfig;
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
  const wallet = createWalletClient({
    transport: custom((window as any).ethereum),
  });
  const { data: meta } = trpc.interchainToken.getInterchainTokenMeta.useQuery(
    {
      tokenId: props.tokenId!,
    },
    {
      enabled: !!props.tokenId,
    }
  );

  const isSuiChain = props.chain.chain_id === SUI_CHAIN_ID;

  let tokenAddress = props.tokenAddress;

  if (isSuiChain && isValidSuiTokenAddress(props.tokenAddress)) {
    tokenAddress = props.tokenAddress.split("::")[0];
  }

  const tokenDetails = [
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
    ...(!isSuiChain
      ? [
          [
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
          ],
        ]
      : []),
    ...Maybe.of(props.tokenManagerAddress).mapOr([], (tokenManagerAddress) =>
      !props.deploymentMessageId
        ? [[]]
        : [
            [
              "Token Manager",
              <CopyToClipboardButton
                key="token-manager"
                $size="sm"
                $variant="ghost"
                copyText={tokenManagerAddress}
              >
                {maskAddress(tokenManagerAddress)}
              </CopyToClipboardButton>,
            ],
          ]
    ),
    ...Maybe.of(props.tokenId).mapOr([], (tokenId) =>
      !props.deploymentMessageId
        ? [[]]
        : [
            [
              "Token ID",
              <div key="token-id" className="flex items-center">
                <CopyToClipboardButton
                  $size="sm"
                  $variant="ghost"
                  copyText={tokenId}
                >
                  {maskAddress(tokenId)}
                </CopyToClipboardButton>
                <Tooltip
                  tip="TokenId is a common key used to identify an interchain token across all chains"
                  $variant="primary"
                  $position="bottom"
                >
                  <InfoIcon className="h-[1em] w-[1em] text-primary" />
                </Tooltip>
              </div>,
            ],
            [
              "Token Ownership Claim Request",
              props.wasDeployedByAccount && props.claimOwnershipFormLink && (
                <LinkButton
                  target="_blank"
                  className="ml-[-10px]"
                  $variant="link"
                  href={props.claimOwnershipFormLink}
                >
                  Link
                </LinkButton>
              ),
            ],
            [
              "Add Your Token on Squid",
              props.wasDeployedByAccount && (
                <div className="flex items-center">
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
                </div>
              ),
            ],
          ]
    ),
    ...Maybe.of(props.tokenManagerAddress).mapOr([], () =>
      !props.deploymentMessageId
        ? [[]]
        : [
            [
              "Apply for coordinated marketing with Axelar",
              props.wasDeployedByAccount && (
                <div className="flex items-center">
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
                </div>
              ),
            ],
          ]
    ),
  ];

  const sanitizedTokenDetails = tokenDetails.filter(([, value]) =>
    Boolean(value)
  );

  function getTokenExplorerLink() {
    if (isSuiChain) {
      return `${props.chain.explorer.url}/object/${props.tokenAddress}`;
    } else {
      return `${props.chain.explorer.url}/token/${props.tokenAddress}`;
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
            on {props.chain.explorer.name}
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
        <Identicon seed={jsNumberForAddress(tokenId)} diameter={36} />
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
