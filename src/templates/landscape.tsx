/** @jsx React.createElement */
import { dirname, fromFileUrl, resolve } from '@std/path';
import * as React from 'react';
import { encodeBase64 } from '@std/encoding';
import { TemplateFactory } from './generateTemplate.ts';

export interface LandscapeTemplateParams {
  title: string;
  image: string;
  fontSize: string;
  canvasSize: number[];
}

// exporting like this to enforce the interface type
const articleTemplate: TemplateFactory<LandscapeTemplateParams> = async (
  params: LandscapeTemplateParams,
  isRaw: boolean = false,
) => {
  const globalStyles = {
    mainBgColor: 'rgb(15, 5, 30)',
    globalWidth: `${params.canvasSize[0]}px`,
    globalHeight: `${params.canvasSize[1]}px`,
    marginLeft: '75px',
    marginTop: '25px',
    widthLimit: '80%',
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
    alignItems: 'flex-end',
  };

  const globalImgStyle: React.CSSProperties = {
    position: 'relative',
  };

  const imgStyles: Record<string, React.CSSProperties> = {
    stripes: {
      position: 'absolute',
    },
    avatar: {
      height: '7.5em',
      marginBottom: '2.5em',
      marginLeft: '75px',
    },
    logo: {
      height: '6em',
      marginBottom: '1em',
      marginRight: '65px',
    },
  };

  const overlayWrapperStyle: React.CSSProperties = {
    marginLeft: globalStyles.marginLeft,
    width: globalStyles.widthLimit,
    marginTop: globalStyles.marginTop,
    height: '60%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignContent: 'center',
    overflowWrap: 'break-word',
  };

  const overlayTextStyle: React.CSSProperties = {
    fontSize: params.fontSize,
    fontFamily: 'Aller',
    textShadow: '2px 2px 5px black',
    textTransform: 'uppercase',
  };

  const __dirname = dirname(fromFileUrl(import.meta.url));
  const [stripes, avatar, logo, gradient] = await Promise.all([
    Deno.readFile(resolve(__dirname, './img/stripes.png')),
    Deno.readFile(resolve(__dirname, './img/avatar.png')),
    Deno.readFile(resolve(__dirname, './img/logo.png')),
    Deno.readFile(resolve(__dirname, './img/gradient.png')),
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
        <img
          style={{ ...globalImgStyle, ...imgStyles.stripes }}
          src={`data:image/png;base64,${encodeBase64(gradient)}`}
        />
        <div style={overlayWrapperStyle}>
          <span id='text' style={overlayTextStyle}>{params.title}</span>
        </div>
        <img
          style={{ ...globalImgStyle, ...imgStyles.stripes }}
          src={`data:image/png;base64,${encodeBase64(stripes)}`}
        />
        <img
          style={{ ...globalImgStyle, ...imgStyles.avatar }}
          src={`data:image/png;base64,${encodeBase64(avatar)}`}
        />
      </main>
    </div>
  );
};

export default articleTemplate;
