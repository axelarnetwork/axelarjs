import { createElement, type ComponentProps, type FC } from "react";

import {
  Clock1Icon,
  Clock2Icon,
  Clock3Icon,
  Clock4Icon,
  Clock5Icon,
  Clock6Icon,
  Clock7Icon,
  Clock8Icon,
  Clock9Icon,
  Clock10Icon,
  Clock11Icon,
  Clock12Icon,
} from "lucide-react";

export {
  HelpCircleIcon,
  ArrowLeftIcon,
  SettingsIcon,
  ExternalLinkIcon,
  InfoIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ClockIcon,
  Clock1Icon,
  Clock2Icon,
  Clock3Icon,
  Clock4Icon,
  Clock5Icon,
  Clock6Icon,
  Clock7Icon,
  Clock8Icon,
  Clock9Icon,
  Clock10Icon,
  Clock11Icon,
  Clock12Icon,
  EyeIcon,
  EyeOffIcon,
  CoinsIcon,
  GiftIcon,
  MenuIcon,
  PenIcon,
  EditIcon,
  Edit2Icon,
  CheckIcon,
  CheckCheckIcon,
  PackageCheckIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  KeyIcon,
  XCircleIcon,
  XIcon,
  ArrowRightIcon,
  CopyIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  MoonIcon,
  SunIcon,
  PlusIcon,
  MinusIcon,
  RefreshCwIcon,
  HourglassIcon,
  JoystickIcon,
} from "lucide-react";

const CLOCK_ICONS = {
  Clock1Icon,
  Clock2Icon,
  Clock3Icon,
  Clock4Icon,
  Clock5Icon,
  Clock6Icon,
  Clock7Icon,
  Clock8Icon,
  Clock9Icon,
  Clock10Icon,
  Clock11Icon,
  Clock12Icon,
};

const getCurrentHourIcon = () => {
  const hour = new Date().getHours();
  const key = `Clock${hour}Icon` as keyof typeof CLOCK_ICONS;

  return CLOCK_ICONS[key];
};

export const CurrentHourClockIcon: FC<ComponentProps<typeof Clock1Icon>> = (
  props
) => {
  const IconComponent = getCurrentHourIcon();

  return createElement(IconComponent, props);
};
