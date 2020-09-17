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
import LoadingCloud from '../components/LoadingCloud';
const useStyles = makeStyles((theme) => {
	return {
		artistPageGrid: {
			width: '100vh'
		},
		wordCloud: {
			width: '90vw',
			margin: 'auto'
		}
	};
});

const ArtistPage = (props) => {
	const classes = useStyles();
	const { artistId } = useParams();
	const { fetchArtist } = props;

	useEffect(
		() => {
			if (artistId) {
				fetchArtist(artistId);
			}
		},
		[ artistId ]
	);
	if (!artistId) return <Redirect to={paths.search} />;
	const { artist, isArtistLoading } = props;
	if (!artist) return null;

	const { name, encodedCloud } = artist;
	return (
		<Grid className={classes.artistPageGrid}>
			<BackButton />
			<Typography variant="h2">{name}</Typography>
			{isArtistLoading ? (
				<LoadingCloud />
			) : !encodedCloud ? null : (
				<img
					src={`data:image/png;base64, ${encodedCloud}`}
					alt={`Rap Cloud for ${name}'s Top Songs`}
					className={classes.wordCloud}
				/>
			)}
			<ArtistSongList artistId={artistId} />
		</Grid>
	);
};

const mapState = (state) => {
	return {
		artist: selectors.getCurrentArtist(state),
		isArtistLoading: selectors.isArtistLoading(state)
	};
};

export default connect(mapState, { fetchArtist })(ArtistPage);
