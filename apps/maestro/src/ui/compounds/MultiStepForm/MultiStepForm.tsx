import {
  Alert,
  AlertCircleIcon,
  ArrowLeftIcon,
  Button,
  ChevronRightIcon,
  cn,
  Dialog,
  DialogProps,
  Label,
  LinkButton,
  Steps,
  TextInput,
  Tooltip,
  useConfirmOnPageLeave,
  useWindowSize,
  XIcon,
} from "@axelarjs/ui";
import tw from "@axelarjs/ui/tw";
import {
  useCallback,
  useMemo,
  useState,
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import type { FieldError } from "react-hook-form";
import { useSession } from "next-auth/react";

import { useAccount } from "wagmi";

import { trpc } from "~/lib/trpc";
import { useEVMChainConfigsQuery } from "~/services/axelarscan/hooks";
import EVMChainsDropdown from "~/ui/components/EVMChainsDropdown";
import ConnectWalletButton from "../ConnectWalletButton";

type ButtonProps = ComponentProps<typeof Button>;

export const ModalFormInput = tw(TextInput)`bg-base-200`;

ModalFormInput.defaultProps = {
  $bordered: true,
};

const StyledButton = tw(Button)`gap-2`;

export const NextButton: FC<ButtonProps> = ({ children, ...props }) => (
  <StyledButton {...props}>
    {children} <ChevronRightIcon className={cn({ hidden: props.loading })} />
  </StyledButton>
);

export const PrevButton: FC<ButtonProps> = ({ children, ...props }) => (
  <StyledButton {...props}>
    <ArrowLeftIcon /> {children}
  </StyledButton>
);

export const StepLoading = () => (
  <div className="grid h-64 place-items-center">
    <LinkButton
      $loading
      $variant="ghost"
      $length="block"
      className="pointer-events-none"
    >
      Loading...
    </LinkButton>
  </div>
);

export const TriggerButton: FC<ButtonProps> = (props) => (
  <Button
    {...props}
    $size="md"
    $variant="primary"
    className="w-full max-w-xs md:max-w-md"
  >
    {props.children}
  </Button>
);

export const BackButton: FC<ButtonProps> = (props) => (
  <PrevButton
    {...props}
    $shape="square"
    $size="lg"
    className="absolute left-0 top-0 rounded-none rounded-br-2xl"
  >
    {props.children}
  </PrevButton>
);

export const ValidationError: FC<FieldError> = ({ message }) => (
  <div role="alert" className="text-error p-1.5 text-xs">
    {message}
  </div>
);

export type StepsSummaryProps = {
  currentStep: number;
  steps: string[];
};

export const StepsSummary: FC<StepsSummaryProps> = (
  props: StepsSummaryProps,
) => {
  return (
    <Steps className="my-6 h-20 w-full text-sm sm:my-10 sm:h-24">
      {props.steps.map((step, index) => (
        <Steps.Step key={step} active={props.currentStep >= index}>
          {step}
        </Steps.Step>
      ))}
    </Steps>
  );
};

export const ChainsDropdown: FC<{ disabled?: boolean; shift?: boolean }> = (
  props,
) => {
  const { width } = useWindowSize();
  return (
    <EVMChainsDropdown
      compact
      disabled={props.disabled}
      triggerClassName={cn("-translate-y-1.5", {
        "btn-outline btn-primary": !props.disabled,
      })}
      hideLabel={width < 640}
      contentClassName={cn("translate-x-28 sm:translate-x-12 z-40", {
        "translate-x-16 sm:translate-x-0": props.shift,
      })}
    />
  );
};

export type ProtectedDialogProps = PropsWithChildren<{
  showBackButton?: boolean;
  disableChainsDropdown?: boolean;
  disableClose?: boolean;
  step: number;
  triggerLabel?: string;
  steps: string[];
  title?: ReactNode;
  onClose: DialogProps["onClose"];
  onBackClick?: () => void;
}>;

export const MultiStepDialog: FC<ProtectedDialogProps> = ({
  triggerLabel,
  steps,
  onClose,
  disableClose,
  disableChainsDropdown,
  ...props
}) => {
  const { status, data } = useSession();
  const { address } = useAccount();

  const isSignedIn =
    status === "authenticated" &&
    address &&
    data?.address &&
    data.address.toLowerCase() === address.toLowerCase();

  const handleClose = useCallback(() => {
    if (disableClose || !onClose) {
      return;
    }
    onClose();
  }, [onClose, disableClose]);

  useConfirmOnPageLeave(
    "You seem to have work in progress. Are you sure you'd like to leave this page?",
    {
      enabled: disableClose,
    },
  );

  return (
    <Dialog
      onClose={handleClose}
      renderTrigger={(props) => (
        <TriggerButton {...props}>{triggerLabel}</TriggerButton>
      )}
    >
      <Dialog.Body $as="section">
        <Dialog.CornerCloseAction
          onClick={handleClose}
          disabled={disableClose}
        />
        {props.title ?? (
          <Dialog.Title className="flex items-center gap-1 sm:gap-2">
            {props.showBackButton && <BackButton onClick={props.onBackClick} />}
            <span
              className={cn("-translate-y-2", {
                "ml-14": props.showBackButton,
              })}
            >
              Register token on:{" "}
            </span>
            <ChainsDropdown
              disabled={disableChainsDropdown}
              shift={props.showBackButton}
            />
          </Dialog.Title>
        )}
        <StepsSummary currentStep={props.step} steps={steps} />
        {isSignedIn ? props.children : <ConnectWalletButton />}
      </Dialog.Body>
    </Dialog>
  );
};

export const ShareHaikuButton: FC<{
  tokenName: string;
  originChainName: string;
  additionalChainNames: string[];
  originAxelarChainId: string;
  tokenAddress: `0x${string}`;
  haikuType: "deployment" | "send";
}> = (props) => {
  const { mutateAsync, isPending, isSuccess } =
    trpc.openai.generateInterchainDeploymentHaiku.useMutation();

  const { computed } = useEVMChainConfigsQuery();

  const additionalChainNames = useMemo(() => {
    return props.additionalChainNames.map((chainName) => {
      const chain = computed.indexedById[chainName];
      return chain?.name ?? "";
    });
  }, [computed, props.additionalChainNames]);

  const handleShareHaiku = useCallback(async () => {
    try {
      const { value } = await mutateAsync({
        ...props,
        additionalChainNames,
        haikuType: props.haikuType,
      });

      const tokenDetailsUrl =
        `${window.location.origin}/${props.originAxelarChainId}/${props.tokenAddress}`
          // repplace // with / to avoid double slash in url
          .replace(/([^:]\/)\/+/g, "$1");

      const tweet = `${value.trim()}\n\nCheck out my Interchain Token:\n${tokenDetailsUrl}\n\n#interchaintokens`;

      // redirect to twitter with haiku
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweet.trim(),
      )}`;

      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
    }
  }, [additionalChainNames, mutateAsync, props]);

  return (
    <Button
      onClick={handleShareHaiku}
      $loading={isPending}
      disabled={isPending || isSuccess}
      className="mt-2 w-full bg-black"
      aria-label="Share an interchain token haiku on X"
    >
      <svg
        height="1em"
        viewBox="0 0 1200 1227"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
          fill="white"
        />
      </svg>
      {isSuccess ? "Done!" : "Share a haiku on X 🎉"}
    </Button>
  );
};

const TOKEN_NAME_DISCLAIMER =
  "Tokens created on the portal will have the same name and symbol on all chains. Build a custom token if you need different names or symbols on different chains.";

export const TokenNameLabelWithTooltip = ({ label = "Token Name" }) => (
  <Label.Text className="inline-flex items-center gap-1">
    {label}
    <Tooltip $position="right" $variant="info" tip={TOKEN_NAME_DISCLAIMER}>
      <AlertCircleIcon className="text-warning mr-1 h-[1em]" />
    </Tooltip>
  </Label.Text>
);

export const TokenNameAlert = () => {
  const [show, setShow] = useState(true);

  if (!show) {
    return null;
  }

  return (
    <Alert $status="info" className="relative">
      <Button
        $size="sm"
        $variant="ghost"
        className="absolute right-1 top-1"
        aria-label="Close"
        onClick={() => setShow(false)}
      >
        <XIcon className="h-4 w-4" />
      </Button>

      {TOKEN_NAME_DISCLAIMER}
    </Alert>
  );
};
