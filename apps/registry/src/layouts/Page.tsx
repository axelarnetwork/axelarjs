import { Clamp } from "@axelarjs/ui/components/core";
import { cn } from "@axelarjs/ui/utils";
import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  className?: string;
}>;

const Page: FC<Props> = ({ children, className, ...props }) => {
  return (
    <Clamp
      $as="section"
      className={cn("mt-20 grid flex-1 px-4 xl:px-2 2xl:px-0", className)}
      {...props}
    >
      {children}
    </Clamp>
  );
};
export default Page;
