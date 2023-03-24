import type { SVGProps } from "react";

const SvgSpinnerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className="spinner-icon_svg__animate-spin spinner-icon_svg__-ml-1 spinner-icon_svg__mr-3 spinner-icon_svg__h-5 spinner-icon_svg__w-5 spinner-icon_svg__text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
    <circle
      style={{
        opacity: 0.25,
      }}
      cx={12}
      cy={12}
      r={10}
      stroke="currentColor"
      strokeWidth={4}
    />
    <path
      style={{
        opacity: 0.75,
      }}
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
export default SvgSpinnerIcon;
