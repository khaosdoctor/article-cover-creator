/** @jsx React.createElement */
import { ImageResponse } from 'x/og_edge@0.0.5/mod.ts';

export const createImageFromHTML = (template: JSX.Element, fontData: ArrayBuffer, width: number, height: number) => {
  return new ImageResponse(template, {
    width,
    height,
    fonts: [
      {
        name: 'Aller',
        data: fontData,
        style: 'normal'
      }
    ]
  }).arrayBuffer()
};
