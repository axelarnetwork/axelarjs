import { useEffect, useState } from "react";

export function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  useEffect(() => {
    setDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });

    const onResize = () =>
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return dimensions;
}
