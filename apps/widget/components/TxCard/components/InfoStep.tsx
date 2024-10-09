import { motion } from "framer-motion";

import LoadingButton from "../../common/LoadingButton";
import { AXELAR_URL, INTERCHAIN_DOCS_URL } from "../../../utils/constants";
import { getAxelarscanBaseURL } from "../../../utils/utils";

interface InfoStepProps {
  goBack: () => void;
}

const InfoStep: React.FC<InfoStepProps> = ({ goBack }) => {
  return (
    <>
      <motion.div className=" w-full flex text-xl text-gray-400">
        AXELAR ITS WIDGET
      </motion.div>
      <motion.div className="w-full my-8 max-h-40 overflow-scroll text-gray-400">
        <motion.p className="mb-4">
          Transfer interchain tokens using the interchain token service
          from&nbsp;
          <motion.a
            href={AXELAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:scale-105 transition-transform duration-100"
          >
            Axelar.
          </motion.a>
        </motion.p>
        <motion.p className="mb-4">
          Use the interchain token id, or the token's address to select an existing interchain token and
          transfer it to an address in any of the available chains.
        </motion.p>
        <motion.p className="mb-4">
          You will be able to keep track of your transactions on&nbsp;
          <motion.a
            href={getAxelarscanBaseURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:scale-105 transition-transform duration-100"
          >
            Axelarscan
          </motion.a>
          &nbsp;once they are submitted.
        </motion.p>
        <motion.p>
          To learn more about the Interchain Token Service visit the&nbsp;
          <motion.a
            href={INTERCHAIN_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pt-4 text-primary hover:scale-105 transition-transform duration-100"
          >
            docs
          </motion.a>
          .
        </motion.p>
      </motion.div>

      <motion.div className="mt-10 flex w-full justify-end">
        <LoadingButton onClick={goBack}>ok!</LoadingButton>
      </motion.div>
    </>
  );
};

export default InfoStep;
