import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
	loadingBar: {
		width: '100%',
		borderRadius: '15%',
		margin: 0,
	},
	loadingBarContainer: {
		width: '100%',
		height: '.4em',
	},
});

const BackButton = (props) => {
	const classes = useStyles();
	const { loading } = props;
	return (
		<div className={classes.loadingBarContainer}>
			{loading && <LinearProgress color="secondary" variant="query" className={classes.loadingBar} />}
		</div>
	);
};

export default BackButton;
