import { ComponentProps } from "react";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import tw from "../../tw";
import { Button } from "../Button";
import { Menu } from "../Menu";

const StyledContent = tw(Menu)`
  radix-side-top:animate-slide-up 
  radix-side-bottom:animate-slide-down
`;

const StyledMenuItem = tw(DropdownMenuPrimitive.Item)`
  rounded-lg outline-none hover:ring-0 focus:opacity-75
`;

export const DropdownMenu = Object.assign(DropdownMenuPrimitive.Root, {
  Trigger: (props: ComponentProps<typeof Button>) => (
    <DropdownMenuPrimitive.Trigger asChild>
      <Button {...props} />
    </DropdownMenuPrimitive.Trigger>
  ),
  Item: (props: ComponentProps<typeof Menu.Item>) => (
    <StyledMenuItem>
      <Menu.Item {...props} />
    </StyledMenuItem>
  ),
  Content: (props: ComponentProps<typeof Menu>) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content sideOffset={5}>
        <StyledContent {...props} />
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  ),
});

export interface DropdownMenuProps
  extends ComponentProps<typeof DropdownMenu> {}
