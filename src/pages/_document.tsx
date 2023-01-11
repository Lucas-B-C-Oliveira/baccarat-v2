import { Html, Main, NextScript, Head } from "next/document";
import { getCssText } from '../styles'


export default function Document() {

  return (
    <Html>
      <Head>
        <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )

}