import Image from "next/image";

const THEME_CONFIG = {
  logo: (
    <div className="flex items-center gap-2">
      <Image
        src="/favicon.png"
        alt="logo"
        width="18"
        height="18"
        className="invert"
      />
      Axelarjs Docs
    </div>
  ),
  project: {
    link: "https://github.com/axelar-nextwork/axelarjs",
  },
  // ...
};

export default THEME_CONFIG;
