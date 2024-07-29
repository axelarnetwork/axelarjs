import tw from "@axelarjs/ui/tw";
import { useEffect } from "react";

const AnimatedBackground = () => {
  useEffect(() => {
    document.addEventListener("CABLES.jsLoaded", function () {
      new window.CABLES.Patch({
        patchFile:
          "https://dl.dropbox.com/scl/fi/wmg7rxpfqoygut7mv8i2f/axelar.json?rlkey=zrhx999xzfo1f9f62beqaylef&dl=0",
        glCanvasId: "intro-anim",
        glCanvasResizeToWindow: true,
        canvas: { alpha: true, premultipliedAlpha: true }, // make canvas transparent
      });
    });
  }, []);
  return <Canvas id="intro-anim" />;
};
export default AnimatedBackground;

const Canvas = tw.canvas`
  fixed
  w-full
  h-full
  top-0
  left-0
  bg-black
`;
