import type { Meta, StoryFn } from "@storybook/react";

import type { IconType } from ".";
import { Tooltip } from "../Tooltip";
import * as lucideIcons from "./lucide";
import * as svgrIcons from "./svgr";

const iconset = Object.entries({ ...svgrIcons, ...lucideIcons });

export default {
  title: "components/Icons",
  component: svgrIcons.AxelarIcon,
} as Meta<typeof svgrIcons.AxelarIcon>;

const Template: StoryFn<IconType> = () => {
  const iconComponents = iconset.map(([, value]) => value);

  return (
    <ul className="flex max-w-4xl flex-wrap gap-2">
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
