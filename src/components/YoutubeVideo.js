import React from 'react';
// import { makeStyles } from '@mui/styles';
import ReactHtmlParser from 'react-html-parser';
import { gcd } from '../utils';

// const useStyles = makeStyles({
// 	backButton: {
// 		// position: 'fixed',
// 		// top: '1em',
// 		// left: '1em'
// 	},
// });

const YoutubeVideo = (props) => {
	// const classes = useStyles();
	const { song } = props;
	const { ytData = {} } = song;
	let { html: ytIframeHtml = '', width: iframeWidth, height: iframeHeight } = ytData;
	if (!ytIframeHtml) return null;
	// ytIframeHtml = ytIframeHtml.replace(`width="${iframeWidth}"`, `width=${iframeWidth / commonDenominator * 100}`);
	ytIframeHtml = ytIframeHtml.replace(`width="${iframeWidth}"`, `width=100%`);
	// ytIframeHtml = ytIframeHtml.replace(`height="${iframeHeight}"`, `height=${iframeHeight / commonDenominator * 100}`);
	const commonDenominator = gcd(iframeWidth, iframeHeight);
	return (
		<div className={`--aspect-ratio: ${iframeWidth / commonDenominator}/${iframeHeight / commonDenominator}`}>
			{ReactHtmlParser(ytIframeHtml)}
		</div>
	);
};

export default YoutubeVideo;
