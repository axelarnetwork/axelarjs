import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-theme="light" className="scroll-smooth">
      <Head>
        {/* Twitter conversion tracking base code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','omouz');`,
          }}
        />
        {/* End Twitter conversion tracking base code */}
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.png" />
        <meta name="msapplication-TileColor" content="#050707" />
        <meta
          name="msapplication-TileImage"
          content="/icons/mstile-150x150.png"
        />
        <meta name="theme-color" content="#050707" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
