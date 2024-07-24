import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en" data-theme="light" className="scroll-smooth">
      <Head>
        {/* Cookies banner code */}
        <script
          async
          type="text/javascript"
          src="//cdn.cookie-script.com/s/1dbb8c364e74a2d20f8ba281fb204aa4.js"
        />
        {/* End cookies banner code */}
        {/* Twitter conversion tracking base code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','omouz');`,
          }}
        />
        {/* End Twitter conversion tracking base code */}
        {/* Background animation scripts */}
        <Script
          src="https://d2my2wpsc41l6t.cloudfront.net/axelar/js/libs.core.min.gz.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://d2my2wpsc41l6t.cloudfront.net/axelar/js/cables.min.gz.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://d2my2wpsc41l6t.cloudfront.net/axelar/js/cgl_copytexture.gz.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://d2my2wpsc41l6t.cloudfront.net/axelar/js/cgl_pixelreader.gz.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://d2my2wpsc41l6t.cloudfront.net/axelar/js/cgl_shadermodifier.gz.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://d2my2wpsc41l6t.cloudfront.net/axelar/js/lottie_canvas.min.gz.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://d2my2wpsc41l6t.cloudfront.net/axelar/js/vargetset.gz.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://d2my2wpsc41l6t.cloudfront.net/axelar/js/combined0409.gz.js"
          strategy="beforeInteractive"
        />
        {/* End background animation scripts */}
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
