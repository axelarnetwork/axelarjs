import { AnimatePresence, motion } from "framer-motion";

import LoadingButton from "../../common/LoadingButton";

interface ErrorContentProps {
  error: string;
  onClickAction: () => void;
}
const ErrorContent: React.FC<ErrorContentProps> = ({
  error,
  onClickAction,
}) => (
  <AnimatePresence>
    <motion.div
      key="error-title"
      className="justify-center w-full flex text-xl"
    >
      <motion.div className="text-red-500">SOMETHING WENT WRONG</motion.div>
    </motion.div>
    <motion.div key="error-desc" className="w-full my-8 px-2 text-red-500 max-h-32 overflow-scroll">
      {error.split("\n")[0]}
    </motion.div>
    <motion.div key="err-loading-btn" className="mt-4 flex w-full justify-end">
      <LoadingButton onClick={onClickAction}>ok</LoadingButton>
    </motion.div>
  </AnimatePresence>
);

export default ErrorContent;
