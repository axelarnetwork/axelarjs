import React from "react";

import Head from "next/head";
import tw from "tailwind-styled-components";

type Props = JSX.IntrinsicElements["section"] & {
  pageTitle?: string;
};

const Page = ({ pageTitle, children, ...props }: Props) => {
  return (
    <>
      {pageTitle && (
        <Head>
          <title>{pageTitle}</title>
        </Head>
      )}
      <section {...props}>{children}</section>
    </>
  );
};

export default Object.assign(Page, {
  Title: tw.h1`text-2xl font-bold`,
});
