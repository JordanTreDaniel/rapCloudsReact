import React, { useState, useEffect, Fragment } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import {
	Typography,
	AppBar,
	Toolbar,
	Grid,
	Avatar,
	Tooltip,
	Paper,
	IconButton,
	withWidth,
	Input,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import SearchIcon from '@material-ui/icons/Search';

import { makeStyles } from '@material-ui/core/styles';
import ArtistSongList from './ArtistSongList';
import BackButton from '../components/BackButton';
import RapCloud from './RapCloud';
import * as selectors from '../redux/selectors';
import { searchSongs, setSongSearchTerm, fetchArtistGame } from '../redux/actions';
import { connect } from 'react-redux';
import paths from '../paths';
import { classNames } from '../redux/utils';
import LoadingBar from '../components/LoadingBar';
import DebouncedInput from '../components/DebouncedInput';
const DebouncedTextField = DebouncedInput(Input, { timeout: 639 });

const useStyles = makeStyles((theme) => {
	return {
		artistGamePage: {
			height: '100%',
			backgroundColor: theme.palette.primary.main,
			overflow: 'hidden',
		},
		mainSearchInput: {
			fontSize: '4em',
			fontWeight: 560,
			margin: '.12em 3vw .12em 9vw',
			color: theme.palette.secondary.main,
			opacity: '.72',
		},
		searchBar: {},
		searchIcon: {
			color: theme.palette.secondary.dark,
			backgroundColor: theme.palette.secondary.main,
			opacity: '.72',
			marginRight: '9vw',
			'&:hover': {
				color: theme.palette.secondary.dark,
				backgroundColor: theme.palette.secondary.main,
			},
		},
		artistAvatar: {
			width: '3.3em',
			height: '3.3em',
		},
		artistName: {
			fontSize: '2.4em',
		},
	};
});

const ArtistGame = (props) => {
	const classes = useStyles();
	const { artistId } = useParams();
	const [ cloudIdx, updateCloudIdx ] = useState(0);
	const { fetchArtistGame, game } = props;
	useEffect(() => {
		if (!game) fetchArtistGame(artistId);
	});
	if (!game) {
		return <h1>Loading</h1>;
	}
	const { clouds = [] } = game;
	const cloud = clouds[cloudIdx] || {};
	const { answers, artist } = cloud;

	return (
		<Grid className={classes.artistGamePage}>
			<Typography>Guess {artist.name}'s RapClouds</Typography>

			{!!game ? (
				<Fragment>
					Current cloud goes here
					{/* Box to show cloud */}
					{/* Multiple choice */}
					{/* next/previous */}
				</Fragment>
			) : null}
		</Grid>
	);
};

const mapState = (state) => ({
	game: selectors.getArtistGame(state),
});

export default connect(mapState, { searchSongs, setSongSearchTerm, fetchArtistGame })(withWidth()(ArtistGame));
