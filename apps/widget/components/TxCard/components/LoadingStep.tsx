import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface LoadingStepContentProps {
  isWaitingForApproval: boolean;
}

const LoadingStepContent = ({
  isWaitingForApproval,
}: LoadingStepContentProps) => (
  <>
    <motion.div className="justify-center w-full flex text-xl text-center text-blue-400 mb-2">
      <AnimatePresence>
        {isWaitingForApproval ? (
          <motion.p>SIGN TRANSACTION IN WALLET</motion.p>
        ) : (
          <motion.p>ESTIMATING FEES...</motion.p>
        )}
      </AnimatePresence>
    </motion.div>
    <motion.div className="flex w-full items-center justify-center">
      <Image
        height={100}
        width={100}
        className="m-5"
        alt="axelar logo loading animation"
        src="/assets/animations/logo.svg"
      />
    </motion.div>
  </>
);

export default LoadingStepContent;
