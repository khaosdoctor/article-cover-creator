/** @jsx React.createElement */
import { ImageResponse } from 'og_edge';

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
