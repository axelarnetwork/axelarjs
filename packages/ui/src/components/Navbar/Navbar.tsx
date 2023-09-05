import type { ComponentProps } from "react";

import tw from "tailwind-styled-components";

const StyledNavbar = tw.div`
  navbar bg-base-100
  px-4 md:px-6
`;

export interface NavbarProps extends ComponentProps<typeof StyledNavbar> {}

export const Navbar = Object.assign(StyledNavbar, {
  Start: tw.div`navbar-start`,
  End: tw.div`navbar-end`,
  Center: tw.div`navbar-center`,
});
