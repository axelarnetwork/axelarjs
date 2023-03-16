import tw from "tailwind-styled-components";

export type NavbarProps = {};

const StyledNavbar = tw.div`navbar bg-base-100`;

export const Navbar = Object.assign(StyledNavbar, {
  Start: tw.div`navbar-start`,
  End: tw.div`navbar-end`,
  Center: tw.div`navbar-center`,
});
