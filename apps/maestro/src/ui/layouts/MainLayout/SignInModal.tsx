import {
  Button,
  CheckCircleIcon,
  cn,
  Dialog,
  KeyIcon,
  Loading,
  XCircleIcon,
} from "@axelarjs/ui";
import type { FC } from "react";

export type SignInModalProps = {
  isSignedIn?: boolean;
  signInError?: null | Error;
  onAbort?: () => void;
};

const SignInModal: FC<SignInModalProps> = ({
  isSignedIn,
  signInError,
  onAbort = () => {},
}) => {
  return (
    <Dialog open trigger={<></>}>
      <Dialog.Body className="grid place-items-center gap-6 py-8 md:min-h-[25vh] md:py-12">
        <div
          className={cn(
            "swap swap-rotate relative grid h-16 w-16 place-items-center",
            {
              "swap-active": isSignedIn || signInError,
            }
          )}
        >
          {signInError ? (
            <XCircleIcon className="swap-on h-12 w-12 text-error md:h-16 md:w-16" />
          ) : (
            <CheckCircleIcon className="swap-on h-12 w-12 text-success md:h-16 md:w-16" />
          )}
          <div className="gird swap-off h-14 w-14 place-items-center md:h-16 md:w-16">
            <Loading className="absolute h-14 w-14 animate-pulse md:h-20 md:w-20" />
            <KeyIcon className="absolute left-[18px] top-[18px] h-7 w-7 animate-pulse md:left-4 md:top-5 md:h-10 md:w-10" />
          </div>
        </div>
        <div className="grid gap-1.5 text-center">
          {signInError ? (
            <span className="text-error/90 md:pt-8">
              {parseSignInErrorMessage(signInError)}
            </span>
          ) : (
            <>
              <span className="text-warning/70">Authentication required</span>
              <span>Please sign in with your wallet to continue</span>
              <Button
                onClick={onAbort}
                $length="block"
                $variant="link"
                $size="lg"
                className="text-error/80"
              >
                cancel & exit
              </Button>
            </>
          )}
        </div>
      </Dialog.Body>
    </Dialog>
  );
};

export default SignInModal;

function parseSignInErrorMessage(error: Error) {
  if ("shortMessage" in error) {
    return String(error.shortMessage);
  }
  return error.message;
}
