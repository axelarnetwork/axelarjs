import type { Meta, StoryFn } from "@storybook/react";

import type { IconType } from ".";
import { Tooltip } from "../Tooltip";
import * as icons from "./svgr";

export default {
  title: "components/Icons",
  component: icons.AxelarIcon,
} as Meta<typeof icons.AxelarIcon>;

const Template: StoryFn<IconType> = () => {
  const iconComponents = Object.keys(icons).map(
    (key) => icons[key as keyof typeof icons]
  );
  return (
    <ul className="flex flex-wrap gap-2">
      {iconComponents.map((Icon) => (
        <>
          <Tooltip tip={Icon.name}>
            <li key={Icon.name}>
              <div className="grid h-12 w-12 place-items-center rounded bg-gray-900/40 text-xl text-gray-50">
                <Icon />
              </div>
            </li>
          </Tooltip>
        </>
      ))}
    </ul>
  );
};

export const Default = Template.bind({});

Default.args = {};
