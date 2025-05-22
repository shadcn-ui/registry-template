import { ImageResponse } from "next/og";

export const contentType = "image/png";

let imageOptions: any = null;

async function initializeImageOptions() {
  if (imageOptions) return imageOptions;

  try {
    imageOptions = {
      width: 1200,
      height: 800,
    };

    return imageOptions;
  } catch (error) {
    throw error;
  }
}

export default async function Image() {
  const options = await initializeImageOptions();

  /*
this Image is rendered using vercel/satori.

Satori supports a limited subset of HTML and CSS features, due to its special use cases. In general, only these static and visible elements and properties that are implemented.
For example, the <input> HTML element, the cursor CSS property are not in consideration. And you can't use <style> tags or external resources via <link> or <script>.
Also, Satori does not guarantee that the SVG will 100% match the browser-rendered HTML output since Satori implements its own layout engine based on the SVG 1.1 spec.
Please refer to Satori’s documentation for a list of supported HTML and CSS features. https://github.com/vercel/satori#css
*/
  return new ImageResponse(
    (
      <div tw="h-full w-full tracking-tight flex flex-col justify-center items-center relative">
        <h1 tw="text-9xl text-center font-semibold">hellno/mini-app-ui</h1>
        <h3 tw="text-4xl font-normal">
          A collection of components, hooks and utilities for mini apps
        </h3>
      </div>
    ),
    options,
  );
}
