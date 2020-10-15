import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	logoDiv: {
		margin: 'auto',
		backgroundImage: `url(\"${process.env.PUBLIC_URL}/rapClouds.png\")`,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
		backgroundSize: 'cover',
		display: 'flex',
	},
	wrapper: {
		minHeight: '100vh',
		minWidth: '100vw',
		backgroundColor: theme.palette.primary.light,
		display: 'flex',
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	innerLoading: { margin: 'auto', color: 'white', width: 'fit-content' },
}));

const SplashScreen = (props) => {
	const classes = useStyles();
	const { width = '42vh', height = '27vh' } = props;
	return (
		<Paper className={classes.wrapper}>
			<div
				className={classes.logoDiv}
				style={{
					width,
					height,
					// marginTop: '18vh', //Cant fix this. Something is wrong.
					overflow: 'visible',
				}}
			/>
		</Paper>
	);
};

export default SplashScreen;
