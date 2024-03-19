import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type FC,
} from "react";

import tw from "../../tw";

export interface AnimatedBlobBackgroundProps
  extends ComponentProps<typeof Container> {}

export const AnimatedBlobBackground: FC<AnimatedBlobBackgroundProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <Container ref={containerRef}>
      <div
        className="absolute w-full max-w-lg"
        style={{
          transform: `translate(${mousePosition.x * 0.03}px, ${
            mousePosition.y * 0.03
          }px)`,
        }}
      >
        <AnimatedBlob className="bg-primary -left-[5dvh] -top-[35dvh]" />
        <AnimatedBlob className="delay-2000 bg-secondary -top-[40dvh] right-[5dvh]" />
        <AnimatedBlob className="delay-4000 bg-accent -top-[35dvh] left-[15dvh]" />
      </div>
      <div className="bg-grid-pattern absolute inset-0" />
    </Container>
  );
};

const Container = tw.div`
  inset-0
  absolute
  flex
  justify-center
  items-center
`;

const AnimatedBlob = tw.div`
  rounded-full
  mix-blend-multiply
  absolute
  filter blur-3xl
  bg-opacity-15
  animate-blob
  size-[28dvh]
`;
