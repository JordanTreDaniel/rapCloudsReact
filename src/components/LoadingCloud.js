import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
	outerLoading: {
		width: '51vw',
		height: '51vw',
		margin: 'auto',
		backgroundImage: 'url("https://media.giphy.com/media/1uLQUtPLbJMQ0/giphy.gif")',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		borderRadius: '50%',
		display: 'flex'
	},
	innerLoading: { margin: 'auto', color: 'white', width: 'fit-content' }
});

const Loading = (props) => {
	const classes = useStyles();

	return (
		<div className={classes.outerLoading}>
			<div className={classes.innerLoading}>
				<Typography variant="h3">Loading...</Typography>
			</div>
		</div>
	);
};

export default Loading;
