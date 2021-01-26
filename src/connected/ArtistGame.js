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
	Box,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import SearchIcon from '@material-ui/icons/Search';

import { makeStyles } from '@material-ui/core/styles';
import ArtistSongList from './ArtistSongList';
import BackButton from '../components/BackButton';
import RapCloud from './RapCloud';
import * as selectors from '../redux/selectors';
import { searchSongs, setSongSearchTerm, fetchArtistGame, fetchSongDetails } from '../redux/actions';
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
		artistAvatar: {
			width: '3.3em',
			height: '3.3em',
		},
		artistName: {
			fontSize: '2.4em',
		},
		quizBoxContainer: {},
		cloud: {
			height: '90%',
			margin: 'auto',
		},
		answerChoice: {
			border: `3px solid ${theme.palette.secondary.main}`,
			margin: '.6em',
			borderRadius: '21px',
			padding: 'inherit',
		},
	};
});

const _QuizBox = (props) => {
	const { question, fetchSongDetails, song, clouds } = props;
	const classes = useStyles();
	const cloud = clouds[0] || {};
	const { answers } = question;
	const { info } = cloud;
	useEffect(() => {
		if (!info) fetchSongDetails(song.id);
	}, []);
	return (
		<Grid container direction="column" className={classes.quizBoxContainer}>
			<Grid item container direction="column">
				<img item src={info && info.secure_url} className={classes.cloud} />
				<Typography align="center">Which song was this RapCloud made from?</Typography>
			</Grid>
			<Grid item>
				<List>
					{answers.map((a) => (
						<ListItem>
							<Box className={classes.answerChoice}>{a.title}</Box>
						</ListItem>
					))}
				</List>
			</Grid>
		</Grid>
	);
};

const mapStateQB = (state, ownProps) => {
	return {
		song: selectors.getSongFromId(state, ownProps.question.songId),
		clouds: selectors.getCloudsForSong(state, ownProps.question.songId),
	};
};
const QuizBox = connect(mapStateQB, { fetchSongDetails })(withWidth()(_QuizBox));

const ArtistGame = (props) => {
	const classes = useStyles();
	const { artistId } = useParams();
	const [ questionIdx, updateQuestionIdx ] = useState(0);
	const { fetchArtistGame, fetchSongDetails, game } = props;
	useEffect(() => {
		if (!game) fetchArtistGame(artistId);
	});
	if (!game) {
		return <h1>Loading</h1>;
	}
	const { questions = [], artist } = game;
	const question = questions[questionIdx] || {};
	return (
		<Grid className={classes.artistGamePage}>
			<Typography>Guess {artist.name}'s RapClouds</Typography>

			<QuizBox question={question} fetchSongDetails={fetchSongDetails} />
		</Grid>
	);
};

const mapState = (state) => ({
	game: selectors.getArtistGame(state),
});

export default connect(mapState, { searchSongs, setSongSearchTerm, fetchArtistGame, fetchSongDetails })(
	withWidth()(ArtistGame),
);
