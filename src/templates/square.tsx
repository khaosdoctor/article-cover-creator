/** @jsx React.createElement */
import { dirname, fromFileUrl, resolve } from '@std/path';
import * as React from 'react';
import { encodeBase64 } from '@std/encoding';
import { TemplateFactory } from './generateTemplate.ts';

export interface SquareTemplateParams {
  title: string;
  image: string;
  fontSize: string;
  canvasSize: number[];
}

const articleTemplate: TemplateFactory<SquareTemplateParams> = async (
  params: SquareTemplateParams,
  isRaw: boolean = false,
) => {
  const globalStyles = {
    mainBgColor: 'rgb(15, 5, 30)',
    globalWidth: `${params.canvasSize[0]}px`,
    globalHeight: `${params.canvasSize[1]}px`,
    marginLeft: '75px',
    marginTop: '55px',
    widthLimit: '40%',
  };

  const bodyStyle: React.CSSProperties = {
    width: globalStyles.globalWidth,
    height: globalStyles.globalHeight,
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    display: 'flex',
  };

  const mainStyle: React.CSSProperties = {
    width: globalStyles.globalWidth,
    height: globalStyles.globalHeight,
    backgroundImage: `url('${params.image}')`,
    backgroundColor: globalStyles.mainBgColor,
    backgroundSize: 'contain',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  };

  const globalImgStyle: React.CSSProperties = {
    position: 'relative',
  };

  const imgStyles: Record<string, React.CSSProperties> = {
    avatar: {
      height: '7.5em',
      marginBottom: '4em',
      zIndex: 10,
    },
  };

  const overlayWrapperStyle: React.CSSProperties = {
    display: 'flex',
    marginTop: '6em',
    alignContent: 'center',
    overflowWrap: 'break-word',
    textAlign: 'center',
    alignItems: 'center',
  };

  const overlayTextStyle: React.CSSProperties = {
    fontSize: params.fontSize,
    fontFamily: 'Aller',
    textShadow: '2px 2px 5px black',
    textTransform: 'uppercase',
    zIndex: 10,
  };

  const gradientStyle: React.CSSProperties = {
    position: 'absolute',
    width: globalStyles.globalWidth,
    height: globalStyles.globalHeight,
    background:
      'radial-gradient(circle, rgba(15,5,30,0.4) 0%, rgba(59,20,117,0.3) 50%, rgba(104,37,201,0.3) 100%)',
    border: '10px solid #0c002296',
    boxSizing: 'border-box',
  };

  const __dirname = dirname(fromFileUrl(import.meta.url));
  const [avatar] = await Promise.all([
    Deno.readFile(resolve(__dirname, './img/avatar.png')),
  ]);

  // Only used for raw templating
  const fontBase64 = encodeBase64(
    await Deno.readFile(resolve(__dirname, './fonts/AllerDisplay.ttf')),
  );

  return (
    <div
      style={bodyStyle}
    >
      {
        /* This exists because we can't load the font face when it's a raw template
				* then we have to load it manually through base64, but this only works if we set
				* a script tag with dangerous html, otherwise I can't manually access `document` to add the FontFace
				* and the template to image function does not accept this type of html
			*/
      }
      {isRaw && (
        <script
          type='text/javascript'
          dangerouslySetInnerHTML={{
            __html: `
					const fontFace = new FontFace('Aller', 'url(data:font/truetype;charset=utf-8;base64,${fontBase64}) format("truetype")')
					document.fonts.add(fontFace)
					fontFace.load().then(() => {
						document.findElementById('text').style.fontFamily = 'Aller'
					})
				`,
          }}
        >
        </script>
      )}
      <main style={mainStyle}>
        {/** There's no support for z-index in SVG, so the elements are rendered by order of appearance */}
        {/** Whats is before will be rendered first and what is after will be rendered on top */}
        {/** The gradient is rendered first, then the overlay and the avatar is rendered last so the gradient doesn't cover it */}
        <div style={gradientStyle}></div>
        <div style={overlayWrapperStyle}>
          <span id='text' style={overlayTextStyle}>{params.title}</span>
        </div>
        <img
          style={{ ...globalImgStyle, ...imgStyles.avatar }}
          src={`data:image/png;base64,${encodeBase64(avatar)}`}
        />
      </main>
    </div>
  );
};

export default articleTemplate;
