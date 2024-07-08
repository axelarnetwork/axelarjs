import { Button, Modal } from "@axelarjs/ui";
import { useLocalStorageState } from "@axelarjs/utils/react/usePersistedState";
import { FC } from "react";
import Image from "next/image";

const ShowOnceModal: FC = () => {
  const [hasSeenOneTimeModal, setHasSeenOneTimeModal] = useLocalStorageState(
    "hasSeenOneTimeModal",
    false
  );

  return (
    <Modal
      open={!hasSeenOneTimeModal}
      hideCloseButton
      trigger={undefined}
    >
      <Modal.Body className="flex flex-col gap-4 max-h-96">
        <Modal.Title className="flex">
          <p className="px-14 py-6 text-center font-medium text-white">
            CREATE A TOKEN THAT CAN SCALE TO ANY CHAIN IN A FEW CLICKS
          </p>
        </Modal.Title>

        <Image
          src="/ilustrations/onboarding-image.png"
          alt="Interchain Banner Teaser"
          layout="responsive"
          width={100}
          height={50}
          objectFit="cover"
          className="h-auto w-full px-6"
        />
        <div className="flex justify-between">
          <p className="w-32 text-center text-sm font-normal text-white">
            CONNECT YOUR WALLET
          </p>
          <p className="w-32 text-center text-sm font-normal text-white">
            CONFIGURE TOKEN SETTINGS
          </p>
          <p className="w-32 text-center text-sm font-normal text-white">
            DEPLOY TO THE PREFERRED CHAINS
          </p>
        </div>

        <div className="mb-6 mt-10 grid place-items-center">
          <Button
            $variant="primary"
            onClick={() => setHasSeenOneTimeModal(true)}
          >
            GET STARTED NOW
          </Button>
          <p className="pt-4 text-xs">SCROLL TO LEARN MORE</p>
        </div>
        <p className="text-lg font-semibold">About</p>
        <div>
          <p className="text-primary text-lg">BRIDGES HAVE THEIR LIMITS</p>
          <p>
            Web3 has gone cross-chain, with assets bridging between blockchains
            and developers deploying applications everywhere. But bridged tokens
            lose their fungibility and their custom features. And it's costly to
            mint tokens on multiple chains.
          </p>
        </div>
        <div>
          <p className="text-primary text-lg">
            WHAT IS INTERCHAIN TOKEN SERVICE?
          </p>
          <p>
            Axelar introduces Interchain Token Service (ITS), supporting
            Interchain Tokens that preserve cross-chain fungibility and custom
            functionality.
          </p>
        </div>

        <p className="pb-10">
          ITS is a product suite that extends tokens cross-chain, preserving
          native qualities while allowing teams to easily manage supply and
          features through the creation of Interchain Tokens.
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default ShowOnceModal;
