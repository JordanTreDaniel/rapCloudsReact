import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Typography, AppBar, Button, Toolbar, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';

import { connect } from 'react-redux';
import ArtistSongList from './ArtistSongList';
import paths from '../paths';
const useStyles = makeStyles((theme) => {
	return {
		artistPageGrid: {
			width: '100vh'
		}
	};
});

const ArtistPage = (props) => {
	const classes = useStyles();
	let { artistId } = useParams();
	const { artist } = props;
	if (!artist) return <Redirect to={paths.search} />;
	const { name } = artist;

	return (
		<Grid className={classes.artistPageGrid}>
			<Typography variant="h2">{name}</Typography>
			<ArtistSongList artistId={artistId} />
		</Grid>
	);
};

const mapState = (state) => {
	return {
		artist: selectors.getCurrentArtist(state)
	};
};

export default connect(mapState, null)(ArtistPage);
