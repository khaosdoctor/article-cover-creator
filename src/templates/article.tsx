/** @jsx React.createElement */
import { dirname, fromFileUrl, resolve } from 'std/path/mod.ts';
import * as React from 'react';

export interface TemplateParams {
	title: string;
	image: string;
	fontSize: string;
	marginLeft: string;
	marginTop: string;
	widthLimit: string;
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
		textTransform: 'uppercase',
	};

	const __dirname = dirname(fromFileUrl(import.meta.url));
	const [stripes, avatar, logo] = await Promise.all([
		Deno.readFile(resolve(__dirname, './img/stripes.png')),
		Deno.readFile(resolve(__dirname, './img/avatar.png')),
		Deno.readFile(resolve(__dirname, './img/logo.png')),
	]);

	return (
		<div
			style={bodyStyle}
		>
			<main style={mainStyle}>
				<div style={overlayWrapperStyle}>
					<span style={overlayTextStyle}>{params.title}</span>
				</div>
				<img
					style={{ ...globalImgStyle, ...imgStyles.stripes }}
					src={`data:image/png;base64,${btoa(String.fromCharCode(...stripes))}`}
				/>
				<img
					style={{ ...globalImgStyle, ...imgStyles.avatar }}
					src={`data:image/png;base64,${btoa(String.fromCharCode(...avatar))}`}
				/>
				<img
					style={{ ...globalImgStyle, ...imgStyles.logo }}
					src={`data:image/png;base64,${btoa(String.fromCharCode(...logo))}`}
				/>
			</main>
		</div>
	);
}
