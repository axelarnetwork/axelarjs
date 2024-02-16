import type { EVMChainConfig } from "@axelarjs/api";
import {
  Alert,
  Badge,
  Button,
  CopyToClipboardButton,
  Edit2Icon,
  ExternalLinkIcon,
  FormControl,
  InfoIcon,
  Label,
  LinkButton,
  Modal,
  TextInput,
  Tooltip,
} from "@axelarjs/ui";
import { toast } from "@axelarjs/ui/toaster";
import { maskAddress, Maybe } from "@axelarjs/utils";
import { useMemo, useState, type FC } from "react";
import Identicon, { jsNumberForAddress } from "react-jazzicon";

import { useAccount } from "wagmi";
import { z } from "zod";

import { NEXT_PUBLIC_ENABLED_FEATURES } from "~/config/env";
import { trpc } from "~/lib/trpc";
import { ChainIcon } from "~/ui/components/EVMChainsDropdown";

export type TokenDetailsSectionProps = {
  name: string;
  symbol: string;
  chain: EVMChainConfig;
  tokenAddress: `0x${string}`;
  wasDeployedByAccount?: boolean;
  decimals: number;
  tokenId?: `0x${string}` | null | undefined;
  tokenManagerAddress?: `0x${string}` | null;
  kind?: "canonical" | "interchain" | "custom";
};

const TokenDetailsSection: FC<TokenDetailsSectionProps> = (props) => {
  const tokenDetails = [
    ["Name", props.name],
    ["Symbol", props.symbol],
    ["Decimals", props.decimals],
    [
      "Token Address",
      <CopyToClipboardButton
        key="token-address"
        size="sm"
        variant="ghost"
        copyText={props.tokenAddress}
      >
        {maskAddress(props.tokenAddress)}
      </CopyToClipboardButton>,
    ],
    ...Maybe.of(props.tokenId).mapOr([], (tokenId) => [
      [
        "Token ID",
        <div key="token-id" className="flex items-center">
          <CopyToClipboardButton size="sm" variant="ghost" copyText={tokenId}>
            {maskAddress(tokenId)}
          </CopyToClipboardButton>
          <Tooltip
            tip="TokenId is a common key used to identify an interchain token across all chains"
            variant="info"
            position="bottom"
          >
            <InfoIcon className="text-info h-[1em] w-[1em]" />
          </Tooltip>
        </div>,
      ],
      [
        "Token Ownership Claim Request",
        props.wasDeployedByAccount && (
          <LinkButton
            target="_blank"
            className="ml-[-10px]"
            variant="link"
            href="https://docs.google.com/forms/u/0/d/1EoA2eYA5OK_BagoB4lgqiS67hIiDpZ7ssov1UUksD_Y/viewform?edit_requested=true"
          >
            Claim
          </LinkButton>
        ),
      ],
    ]),
    ...Maybe.of(props.tokenManagerAddress).mapOr([], (tokenManagerAddress) => [
      [
        "Token Manager",
        <CopyToClipboardButton
          key="token-manager"
          size="sm"
          variant="ghost"
          copyText={tokenManagerAddress}
        >
          {maskAddress(tokenManagerAddress)}
        </CopyToClipboardButton>,
      ],
    ]),
  ];

  const sanitizedTokenDetails = tokenDetails.filter(([, value]) =>
    Boolean(value)
  );

  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 text-2xl font-bold md:gap-3">
          {props.tokenId && <ManageTokenIcon tokenId={props.tokenId} />}

          {Boolean(props.name && props.symbol) && (
            <div className="grid -space-y-1">
              <span className="text-primary text-lg">{props.symbol}</span>{" "}
              <span className="text-base opacity-50">{props.name}</span>
            </div>
          )}
        </div>
        <LinkButton
          className="flex items-center gap-2 text-lg"
          href={`${props.chain.explorer.url}/token/${props.tokenAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
        >
          <ChainIcon src={props.chain.image} alt={props.chain.name} size="md" />
          <span>View token</span>
          <span className="hidden sm:ml-[-4px] sm:block">
            on {props.chain.explorer.name}
          </span>
          <ExternalLinkIcon className="h-4 w-4 translate-x-1" />
        </LinkButton>
      </div>

      {props.kind === "canonical" && (
        <div className="italic">
          This is a pre-existing token on {props.chain.name} that was registered
          on ITS, powered by Axelar
        </div>
      )}
      <ul className="grid gap-1.5">
        {sanitizedTokenDetails.map(([label, value]) => (
          <li
            key={String(label)}
            className="md:text-md flex items-center gap-2 text-sm lg:text-lg"
          >
            <span className="font-semibold">{label}: </span>
            <span className="opacity-60">{value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

type ManageTokenIconProps = {
  tokenId: `0x${string}`;
};

const ManageTokenIcon: FC<ManageTokenIconProps> = ({ tokenId }) => {
  const { data: meta, refetch } =
    trpc.interchainToken.getInterchainTokenMeta.useQuery({
      tokenId,
    });
  const { address } = useAccount();

  const { data: roles } =
    trpc.interchainToken.getInterchainTokenRolesForAccount.useQuery(
      {
        tokenId,
        accountAddress: address as `0x${string}`,
      },
      {
        enabled: Boolean(address),
      }
    );

  const isOperator = roles?.tokenManager?.includes("OPERATOR");

  const icon = (
    <div className="ring-primary/50 ring-offset-base-100 relative grid h-9 w-9 place-items-start rounded-full ring-2 ring-offset-2">
      {meta?.iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={meta.iconUrl} alt="token icon" className="h-9 w-9" />
      ) : (
        <Identicon seed={jsNumberForAddress(tokenId)} diameter={36} />
      )}
    </div>
  );

  if (
    !isOperator ||
    !NEXT_PUBLIC_ENABLED_FEATURES.includes("MANAGE_TOKEN_ICON")
  ) {
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

type UpdateTokenIconProps = {
  tokenId: `0x${string}`;
  existingIconUrl?: string;
  onUpdated?: () => void;
  icon?: JSX.Element;
};

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

  const { mutate, isLoading, error, reset } =
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

    if ([".png", ".jpg", ".svg"].every((ext) => !iconUrl.endsWith(ext))) {
      return (
        <>
          URL must end with <Badge variant="neutral">.png</Badge>,{" "}
          <Badge variant="neutral">.jpg</Badge>, or{" "}
          <Badge variant="neutral">.svg</Badge>
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
    <Tooltip tip="Manage token icon" position="bottom">
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
        <Modal.Title>
          <span className="text-xl font-bold">Manage token icon</span>
        </Modal.Title>
        <Modal.Body>
          <FormControl>
            <Label className="flex items-center justify-start gap-2">
              Token Icon UR{" "}
              <Tooltip
                tip="Provide a URL to an image to use as the token icon"
                position="right"
              >
                <InfoIcon className="text-info h-[1em]" />
              </Tooltip>
            </Label>
            <TextInput
              defaultValue={sanitizedUrl}
              className="bg-base-200"
              placeholder="Enter a url for a valid png, jpg, or svg icon"
              readOnly={isLoading}
              onChange={(e) => {
                reset();
                setIconUrl(e.target.value);
              }}
            />
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
            <Alert status="error">{formValidationMessage}</Alert>
          ) : (
            <Button
              length="block"
              variant="primary"
              loading={isLoading}
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

export default TokenDetailsSection;
