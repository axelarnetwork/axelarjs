import { useEffect, useState } from "react";

export function useIsSticky(offset: number = 200, axis: "y" | "x" = "y") {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const $offset = axis === "y" ? window.scrollY : window.scrollX;
      if ($offset > offset) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset, axis]);

  return isSticky;
}
