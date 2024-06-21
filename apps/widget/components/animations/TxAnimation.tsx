import { motion } from "framer-motion";

interface AnimationProps {
  leftImageUrl: string;
  movingImageUrl: string;
  rightImageUrl: string;
}

const TxAnimation: React.FC<AnimationProps> = ({
  leftImageUrl,
  movingImageUrl,
  rightImageUrl,
}) => {
  return (
    <motion.div className="flex w-full ">
      <motion.img
        animate={{
          scale: [1, 0.8, 1.3, 0.9, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.4, 0.5, 0.6, 0.65, 1],
          repeat: Infinity,
          repeatDelay: 1,
        }}
        className="w-10 h-10 me-2 rounded-full"
        src={leftImageUrl}
        alt="Selected user image"
      />
      <motion.img
        animate={{
          scale: [1, 0.8, 1.3, 0.9, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.4, 0.5, 0.6, 0.65, 1],
          repeat: Infinity,
          repeatDelay: 1,
        }}
        className="w-10 h-10 me-2 rounded-full"
        src={movingImageUrl}
        alt="Selected user image"
      />

      <motion.img
        animate={{
          scale: [1, 0.8, 1.3, 0.9, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.4, 0.5, 0.6, 0.65, 1],
          repeat: Infinity,
          repeatDelay: 1,
        }}
        className="w-10 h-10 me-2 rounded-full"
        src={rightImageUrl}
        alt="Selected user image"
      />
    </motion.div>
  );
};

export default TxAnimation;
