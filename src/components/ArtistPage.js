import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Typography, AppBar, Button, Toolbar, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { fetchArtist } from '../redux/actions';

import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => {
	return {};
});

const ArtistPage = (props) => {
	const classes = useStyles();
	let { artistId } = useParams();

	const { artist, history, fetchArtist } = props;
	useEffect(() => {
		console.log('use effect');
		fetchArtist(artistId);
	}, []);
	// if (!artist) return null;

	return <h1>Artist Page</h1>;
};

const mapState = (state) => ({
	song: selectors.getCurrentSong(state)
});

export default connect(mapState, { fetchArtist })(ArtistPage);
