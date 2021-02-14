import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withWidth, Grid } from '@material-ui/core';
const useStyles = makeStyles({
	backgroundVideoBox: {
		position: 'relative',
	},
	backgroundVideo: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		minWidth: '100%',
		height: '91vh', //TO-DO: Get it so that the MINIMUM height is 91vh, and it grows to cover the answer section on mobile
	},
});

const FlyWithMe = (props) => {
	const classes = useStyles();
	const { children, width } = props;
	return (
		<Grid item container id="backgroundVideoBox" className={classes.backgroundVideoBox} xs={12}>
			<video
				autoPlay
				muted
				loop
				className={classes.backgroundVideo}
				style={{ height: width === 'xs' ? '91vh' : 'auto' }}
			>
				<source src={`${process.env.PUBLIC_URL}/flywithme2.mp4`} type="video/mp4" />
			</video>
			{children}
		</Grid>
	);
};

export default withWidth()(FlyWithMe);
