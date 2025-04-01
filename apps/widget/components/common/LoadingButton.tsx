import { motion } from "framer-motion";

import LoadingSpinner from "../animations/LoadingSpinner";

interface LoadingButtonProps {
  isLoading?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: string;
  disabled?: boolean;
}

const variants: Record<string, string> = {
  primary:
    "bg-primary text-black px-10 py-2 rounded-md focus:outline-none transform hover:scale-105 transition-transform duration-100 font-semibold",
  disabled:
    "border border-gray-600 text-gray-600 px-10 py-2 rounded-md focus:outline-none transform font-semibold",
};

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  onClick,
  children,
  variant = "primary",
  disabled = false,
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={disabled ? variants["disabled"] : variants[variant]}
    >
      {isLoading ? (
        <div className="px-2">
          <LoadingSpinner w={24} h={24} />
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default LoadingButton;
