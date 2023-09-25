import { useEffect, type FC } from "react";
import { Router } from "next/router";

import NProgress, { type NProgressOptions } from "nprogress";

Router.events.on("routeChangeStart", NProgress.start.bind(NProgress));
Router.events.on("routeChangeComplete", NProgress.done.bind(NProgress));
Router.events.on("routeChangeError", NProgress.done.bind(NProgress));

type Props = {
  options?: NProgressOptions;
};

const NProgressBar: FC<Props> = ({ options = {} }) => {
  useEffect(() => {
    NProgress.configure(options);
  }, [options]);

  return null;
};

export default NProgressBar;
