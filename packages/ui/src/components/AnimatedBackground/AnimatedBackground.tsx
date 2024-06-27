import { FC } from "react";

import tw from "../../tw";

export const AnimatedBackground: FC = () => {
  return (
    <Container>
      <video
        autoPlay
        muted
        loop
        playsInline
        id="bg-video"
        className="fixed inset-0 z-[-1] h-full w-full object-cover"
      >
        <source src="/bg-animation.mp4" type="video/mp4" />
        {/* TODO: add fallback img */}
      </video>
    </Container>
  );
};

const Container = tw.div`
  inset-0
  fixed
  flex
  justify-center
  items-center
  overflow-hidden
`;
