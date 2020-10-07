import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	outerLoading: {
		margin: 'auto',
		backgroundImage: `url(\"${process.env.PUBLIC_URL}/rapClouds.png\")`,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
		backgroundSize: 'cover',
		display: 'flex',
	},
	innerLoading: { margin: 'auto', color: 'white', width: 'fit-content' },
});

const SplashScreen = (props) => {
	const classes = useStyles();
	const { width = '42vh', height = '27vh' } = props;
	return (
		<div
			className={classes.outerLoading}
			style={{
				width,
				height,
				marginTop: '18vh',
				overflow: 'visible',
			}}
		/>
	);
};

export default SplashScreen;
