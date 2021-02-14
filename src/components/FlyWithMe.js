import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withWidth, Grid } from '@material-ui/core';
import { classNames } from '../utils';
const useStyles = makeStyles({
	backgroundVideoBox: {
		position: 'relative',
		height: '91vh',
	},
	backgroundVideo: {
		position: 'absolute',
		bottom: 0,
		minWidth: '100%',
		height: '91vh', //TO-DO: Get it so that the MINIMUM height is 91vh, and it grows to cover the answer section on mobile
	},
	backgroundVideoR0: {
		right: 0,
	},
});

const FlyWithMe = (props) => {
	const classes = useStyles();
	const { children, width, includeRightZero } = props;
	return (
		<Grid
			item
			container
			justify="center"
			alignItems="center"
			alignContent="center"
			id="backgroundVideoBox"
			className={classes.backgroundVideoBox}
			xs={12}
		>
			<video
				autoPlay
				muted
				loop
				className={classNames(classes.backgroundVideo, includeRightZero && classes.backgroundVideoR0)}
				style={{ height: width === 'xs' ? '91vh' : 'auto' }}
			>
				<source src={`${process.env.PUBLIC_URL}/flywithme2.mp4`} type="video/mp4" />
			</video>
			{children}
		</Grid>
	);
};

export default withWidth()(FlyWithMe);
