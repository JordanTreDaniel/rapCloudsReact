import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
	outerLoading: {
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
	const { width = '45vh', height = '45vh' } = props;
	return (
		<div className={classes.outerLoading} style={{ width, height, marginTop: '18vh' }}>
			<div className={classes.innerLoading}>
				<Typography variant="h3">Loading...</Typography>
			</div>
		</div>
	);
};

export default Loading;
