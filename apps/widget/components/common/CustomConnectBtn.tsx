import Image from "next/image";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import LoadingButton from "./LoadingButton";

export const CustomConnectBtn = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div className="text-sm">
                    <LoadingButton onClick={openConnectModal}>
                      Connect Wallet
                    </LoadingButton>
                  </div>
                );
              }
              if (chain.unsupported) {
                return (
                  <LoadingButton onClick={openChainModal}>
                    <p className="text-sm"> Wrong network</p>
                  </LoadingButton>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <LoadingButton variant="disabled" onClick={openChainModal}>
                    <div className="flex items-center justify-between">
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 20,
                            height: 20,
                            borderRadius: 999,
                            overflow: "hidden",
                          }}
                        >
                          {chain.iconUrl && (
                            <Image
                              height={20}
                              width={20}
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </LoadingButton>
                  <LoadingButton variant="disabled" onClick={openAccountModal}>
                    <Image
                      alt="avatar"
                      width={24}
                      height={24}
                      src={account.ensAvatar || "/assets/icons/avatar.svg"}
                    ></Image>
                  </LoadingButton>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
