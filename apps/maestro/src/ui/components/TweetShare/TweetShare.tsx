import { cn } from "@axelarjs/ui";
import type { FC } from "react";

interface TweetShareProps {
  tweetText: string;
  className?: string;
}

const TweetShare: FC<TweetShareProps> = ({ tweetText, className }) => {
  // Construct the Twitter share URL
  const twitterShareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText,
  )}`;

  return (
    <a
      href={twitterShareURL}
      target="_blank"
      rel="noopener noreferrer"
      role="button"
      className={cn("btn bg-blue-400 text-white hover:bg-blue-300", className)}
    >
      Share on Twitter
    </a>
  );
};

export default TweetShare;
