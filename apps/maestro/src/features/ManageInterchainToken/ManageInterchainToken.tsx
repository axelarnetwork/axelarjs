import {
  Button,
  cn,
  CoinsIcon,
  GiftIcon,
  LinkButton,
  Modal,
  PackageCheckIcon,
} from "@axelarjs/ui";
import { useMemo, type ComponentType, type FC } from "react";
import dynamic from "next/dynamic";

import {
  INITIAL_STATE,
  ManageInterchainTokenProvider,
  useManageInterchainTokenContainer,
  type InterchainTokenAction,
} from "./ManageInterchaintoken.state";

const StepLoading = () => (
  <div className="grid h-64 place-items-center">
    <LinkButton
      loading
      variant="ghost"
      length="block"
      className="pointer-events-none"
    >
      Loading...
    </LinkButton>
  </div>
);

const MintInterchainToken = dynamic(
  () => import("~/features/ManageInterchainToken/actions/mint"),
  {
    loading: StepLoading,
  }
);

const TransferOwnership = dynamic(
  () => import("~/features/ManageInterchainToken/actions/transfer-ownership"),
  {
    loading: StepLoading,
  }
);

const TransferOperatorship = dynamic(
  () =>
    import("~/features/ManageInterchainToken/actions/transfer-operatorship"),
  {
    loading: StepLoading,
  }
);

const TransferMintership = dynamic(
  () => import("~/features/ManageInterchainToken/actions/transfer-mintership"),
  {
    loading: StepLoading,
  }
);

const ACTIONS: Record<InterchainTokenAction, ComponentType<any>> = {
  mint: MintInterchainToken,
  transferOwnership: TransferOwnership,
  transferOperatorship: TransferOperatorship,
  transferMintership: TransferMintership,
  acceptOwnership: TransferOwnership,
};

type Props = {
  trigger?: JSX.Element;
  balance: bigint;
  tokenAddress: `0x${string}`;
  isTokenOwner: boolean;
  isTokenMinter: boolean;
  isTokenPendingOnwer: boolean;
  hasPendingOwner: boolean;
  onClose?: () => void;
};

type Option = {
  label: string;
  value: InterchainTokenAction;
  icon: JSX.Element;
  disabled?: boolean;
  isVisible: (props: Props) => boolean;
};

export const ManageInterchainToken: FC<Props> = (props) => {
  const [state, actions] = useManageInterchainTokenContainer();

  const options: Option[] = [
    {
      label: "Mint",
      value: "mint",
      icon: <CoinsIcon className="h-7 w-7 md:h-8 md:w-8" />,
      isVisible: (props) => props.isTokenMinter,
    },
    {
      label: "Transfer Ownership",
      value: "transferOwnership",
      icon: <GiftIcon className="h-7 w-7 md:h-8 md:w-8" />,
      isVisible: (props) => props.isTokenOwner && !props.hasPendingOwner,
    },
    {
      label: "Transfer Rate Limit Manager",
      value: "transferOperatorship",
      icon: <GiftIcon className="h-7 w-7 md:h-8 md:w-8" />,
      isVisible: (props) => props.isTokenMinter && !props.hasPendingOwner,
    },
    {
      label: "Transfer Mintership",
      value: "transferMintership",
      icon: <GiftIcon className="h-7 w-7 md:h-8 md:w-8" />,
      isVisible: (props) => props.isTokenMinter,
    },
    {
      label: "Ownnership Pending Approval",
      value: "transferOwnership",
      icon: <GiftIcon className="h-7 w-7 md:h-8 md:w-8" />,
      disabled: true,
      isVisible: (props) => props.isTokenOwner && props.hasPendingOwner,
    },
    {
      label: "Accept Ownership",
      value: "acceptOwnership",
      icon: <PackageCheckIcon className="h-7 w-7 md:h-8 md:w-8" />,
      isVisible: (props) => props.isTokenPendingOnwer,
    },
  ];

  const CurrentStep = useMemo(
    () => (state.selectedAction ? ACTIONS[state.selectedAction] : undefined),
    [state.selectedAction]
  );

  return (
    <Modal
      trigger={props.trigger}
      open={state.isModalOpen}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          actions.openModal();
        } else {
          actions.closeModal();
          actions.reset();
          props.onClose?.();
        }
      }}
    >
      <Modal.Body
        className={cn("flex flex-col gap-4", {
          "": state.selectedAction === "mint",
        })}
      >
        {CurrentStep ? (
          <CurrentStep />
        ) : (
          <>
            <Modal.Title className="flex">
              <span>Manage Interchain Token</span>
            </Modal.Title>
            <ul className="grid grid-cols-2 gap-2">
              {options
                .filter((option) => option.isVisible(props))
                .map((option) => (
                  <li key={option.value}>
                    <Button
                      className="grid h-24 w-full place-items-center gap-2.5 p-3 md:h-32"
                      onClick={actions.selectAction.bind(null, option.value)}
                      disabled={option.disabled}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </Button>
                  </li>
                ))}
            </ul>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

const WithManageInterchainTokenProvider: FC<Props> = (props) => (
  <ManageInterchainTokenProvider
    initialState={{
      ...INITIAL_STATE,
      tokenAddress: props.tokenAddress,
    }}
  >
    <ManageInterchainToken {...props} />
  </ManageInterchainTokenProvider>
);

export default WithManageInterchainTokenProvider;
