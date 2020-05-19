import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Typography, AppBar, Button, Toolbar, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fetchArtist } from '../redux/actions';

import { connect } from 'react-redux';
import ArtistSongList from './ArtistSongList';

const useStyles = makeStyles((theme) => {
	return {
		artistPageGrid: {
			width: '100vh'
		}
	};
});

const ArtistPage = (props) => {
	const classes = useStyles();

	const { fetchArtist, artistId } = props;
	useEffect(() => {
		console.log('use effect');
		fetchArtist(artistId);
	}, []);

	return (
		<Grid className={classes.artistPageGrid}>
			<h1>Artist Page</h1>
			<ArtistSongList artistId={artistId} />
		</Grid>
	);
};

export default connect(null, { fetchArtist })(ArtistPage);
