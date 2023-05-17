import { useEffect, type FC } from "react";

import { Router } from "next/router";
import NProgress, { type NProgressOptions } from "nprogress";

Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeComplete", NProgress.done);
Router.events.on("routeChangeError", NProgress.done);

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
