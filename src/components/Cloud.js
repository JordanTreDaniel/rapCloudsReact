import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchSongDetails } from '../redux/actions';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';

const useStyles = (theme) => {
	return makeStyles({
		header: {
			fontWeight: 2
		}
	});
};

const RapCloud = (props) => {
	const classes = useStyles();
	let { songId } = useParams();
	const { fetchSongDetails } = props;
	useEffect(() => {
		console.log('use EFfect!!', { fetchSongDetails, songId });
		fetchSongDetails(songId);
	}, []);

	return (
		<Typography variant="h1" className={classes.header}>
			RapCloud
		</Typography>
	);
};

export default connect(null, { fetchSongDetails })(RapCloud);
