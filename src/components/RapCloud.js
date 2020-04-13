import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchSongDetails } from '../redux/actions';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import * as selectors from '../redux/selectors';
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
	const { fetchSongDetails, song } = props;
	useEffect(() => {
		console.log('use EFfect!!', { fetchSongDetails, songId, song });
		fetchSongDetails(songId);
	}, []);

	return (
		<React.Fragment>
			<Typography variant="h1" className={classes.header}>
				RapCloud
			</Typography>
			<br />
			<Typography variant="p">{song ? song.lyrics : null}</Typography>
		</React.Fragment>
	);
};

const mapState = (state) => {
	return {
		song: selectors.getCurrentSong(state)
	};
};
export default connect(mapState, { fetchSongDetails })(RapCloud);
