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
import CloudDone from '@material-ui/icons/CloudDone';
import CloudQueue from '@material-ui/icons/CloudQueue';
import CloudOff from '@material-ui/icons/CloudOff';

import { makeStyles } from '@material-ui/core/styles';
import ArtistSongList from './ArtistSongList';
import BackButton from '../components/BackButton';
import RapCloud from './RapCloud';
import * as selectors from '../redux/selectors';
import { searchSongs, setSongSearchTerm, fetchArtistGame, fetchSongDetails, answerQuestion } from '../redux/actions';
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
			cursor: 'pointer',
		},
	};
});

const _QuizBox = (props) => {
	const { question, fetchSongDetails, answerQuestion, song, clouds, gameId, questionIdx } = props;
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
			</Grid>
			<Grid item>
				<List>
					{answers.map((a, i) => (
						<ListItem>
							<Box
								className={classes.answerChoice}
								onClick={() => answerQuestion(gameId, questionIdx, i)}
							>
								<ListItemText>{a.title}</ListItemText>
							</Box>
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
const QuizBox = connect(mapStateQB, { fetchSongDetails, answerQuestion })(withWidth()(_QuizBox));

const ArtistGame = (props) => {
	const classes = useStyles();
	const { artistId } = useParams();
	const [ questionIdx, updateQuestionIdx ] = useState(0);
	const { fetchArtistGame, fetchSongDetails, game } = props;
	useEffect(() => {
		if (!game) fetchArtistGame(artistId);
	});
	const { questions = [], artist } = game || {};
	if (!questions.length || !artist) {
		return <h1>Loading</h1>;
	}
	const question = questions[questionIdx];
	return (
		<Grid className={classes.artistGamePage}>
			<Grid
				container
				direction="row"
				wrap="nowrap"
				alignContent="center"
				justify="space-around"
				className={classes.ul}
			>
				{questions.map((question, index) => {
					let children;
					const { answerIdx } = question;
					const answer = question.answers[answerIdx];
					if (!answer) {
						children = <CloudQueue />;
					} else if (answer.correct) {
						children = <CloudDone />;
					} else {
						children = <CloudOff />;
					}
					return (
						<Grid item key={index}>
							{children}
						</Grid>
					);
				})}
			</Grid>
			<Typography align="center" variant="h6">
				Which {artist.name} song was this RapCloud made from?
			</Typography>
			<QuizBox
				question={question}
				gameId={game.id}
				questionIdx={questionIdx}
				fetchSongDetails={fetchSongDetails}
			/>
		</Grid>
	);
};

const mapState = (state) => ({
	game: selectors.getArtistGame(state),
});

export default connect(mapState, { searchSongs, setSongSearchTerm, fetchArtistGame, fetchSongDetails })(
	withWidth()(ArtistGame),
);
