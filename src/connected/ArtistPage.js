import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Typography, AppBar, Button, Toolbar, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { fetchArtist } from '../redux/actions';
import { connect } from 'react-redux';
import ArtistSongList from './ArtistSongList';
import paths from '../paths';
import BackButton from '../components/BackButton';
const useStyles = makeStyles((theme) => {
	return {
		artistPageGrid: {
			width: '100vh'
		}
	};
});

const ArtistPage = (props) => {
	const classes = useStyles();
	const { artistId } = useParams();
	const { fetchArtist } = props;
	console.log({ artistId });
	useEffect(
		() => {
			if (artistId) {
				fetchArtist(artistId);
			}
		},
		[ artistId ]
	);
	if (!artistId) return <Redirect to={paths.search} />;
	const { artist } = props;
	if (!artist) return null;

	const { name } = artist;
	return (
		<Grid className={classes.artistPageGrid}>
			<BackButton />
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

export default connect(mapState, { fetchArtist })(ArtistPage);
