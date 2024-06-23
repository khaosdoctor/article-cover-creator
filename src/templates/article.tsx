/** @jsx React.createElement */
import { dirname, fromFileUrl, resolve } from '@std/path';
import * as React from 'react';

export interface TemplateParams {
	title: string;
	image: string;
	fontSize: string;
	marginLeft: string;
	marginTop: string;
	widthLimit: string;
}

function bufferToBase64 (bufferLike: ArrayBuffer): string {
	const bufferAsString = new Uint8Array(bufferLike).reduce((data, byte) => `${data}${String.fromCharCode(byte)}`, '')
	return btoa(bufferAsString)
}

export async function articleTemplate(params: TemplateParams) {
	const globalStyles = {
		mainBgColor: 'rgb(15, 5, 30)',
		globalWidth: '1440px',
		globalHeight: '732px',
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
			top: '0',
			left: '0',
		},
		avatar: {
			height: '7.5em',
			marginBottom: '1em',
			marginLeft: '75px',
		},
		logo: {
			height: '6em',
			marginBottom: '1em',
			marginRight: '65px',
		},
	};

	const overlayWrapperStyle: React.CSSProperties = {
		marginLeft: params.marginLeft,
		width: params.widthLimit,
		marginTop: params.marginTop,
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

	return (
		<div
			style={bodyStyle}
		>
			<main style={mainStyle}>
				<img style={{...globalImgStyle, ...imgStyles.stripes}} src={`data:image/png;base64,${bufferToBase64(gradient)}`} />
				<div style={overlayWrapperStyle}>
					<span style={overlayTextStyle}>{params.title}</span>
				</div>
				<img
					style={{ ...globalImgStyle, ...imgStyles.stripes }}
					src={`data:image/png;base64,${bufferToBase64(stripes)}`}
				/>
				<img
					style={{ ...globalImgStyle, ...imgStyles.avatar }}
					src={`data:image/png;base64,${bufferToBase64(avatar)}`}
				/>
				<img
					style={{ ...globalImgStyle, ...imgStyles.logo }}
					src={`data:image/png;base64,${bufferToBase64(logo)}`}
				/>
			</main>
		</div>
	);
}
