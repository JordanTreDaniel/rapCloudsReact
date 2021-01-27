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
import { classNames } from '../utils';
import LoadingBar from '../components/LoadingBar';
import DebouncedInput from '../components/DebouncedInput';
const DebouncedTextField = DebouncedInput(Input, { timeout: 639 });

const useStyles = makeStyles((theme) => {
	return {
		artistGamePage: {
			minHeight: '91vh', //TO-DO: Why doesn't 100% height work here, but does work on ArtistPage? Content/children?
			width: '100%',
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
		miniCloud: {
			marginRight: '1.2em',
			cursor: 'pointer',
			textAlign: 'center',
		},
		currentMiniCloud: {
			backgroundColor: theme.palette.secondary.main,
			borderRadius: '5px',
			padding: '.12em',
		},
		blueTxt: { color: theme.palette.secondary.main },
		blackTxt: { color: theme.palette.primary.dark },
		unanswered: {
			color: theme.palette.primary.dark,
		},
		green: {
			color: theme.palette.success.main,
		},
		red: {
			color: theme.palette.error.main,
		},
		correctAnswer: {
			border: `3px solid ${theme.palette.success.main} !important`,
		},
		incorrectAnswer: {
			border: `3px solid ${theme.palette.error.main} !important`,
		},
		quizBoxContainer: {},
		quizBoxWrapper: {},
		cloud: {
			width: '100%',
			margin: 'auto',
		},
		decoyAnswer: {
			border: `3px solid ${theme.palette.secondary.main}`,
		},
		answerChoice: {
			margin: '.6em',
			borderRadius: '21px',
			padding: 'inherit',
			cursor: 'pointer',
		},
		scoreBoard: {
			overflowX: 'scroll',
		},
		textPlaceholder: {
			width: '100%',
		},
	};
});

const _QuizBox = (props) => {
	const {
		questions,
		fetchSongDetails,
		answerQuestion,
		song,
		clouds,
		gameId,
		questionIdx,
		updateQuestionIdx,
		isSongDetailLoading,
		isWordCloudLoading,
		areSongLyricsLoading,
	} = props;
	const question = questions[questionIdx];
	const classes = useStyles();
	const cloud = clouds[0] || {};
	const { answers, answerIdx } = question;
	const { info } = cloud;
	const isAnswered = answerIdx == 0 || answerIdx;
	const letters = [ 'A', 'B', 'C', 'D' ];
	useEffect(() => {
		let newIdx = questionIdx + 1;
		if (isAnswered) {
			let nextQuestion = questions[newIdx];
			let nextQuestionAnswered = nextQuestion.answerIdx == 0 || nextQuestion.answerIdx;
			while (nextQuestionAnswered) {
				newIdx++;
				nextQuestion = questions[newIdx];
				nextQuestionAnswered = nextQuestion.answerIdx == 0 || nextQuestion.answerIdx;
			}
			updateQuestionIdx(newIdx);
		}
	}, []);
	useEffect(
		() => {
			if (questionIdx == 0) {
				if (!info) fetchSongDetails(question.songId);
			}
			const nextQuestion = questions[questionIdx + 1];
			if (nextQuestion) {
				fetchSongDetails(nextQuestion.songId);
			}
		},
		[ questionIdx ],
	);

	return (
		<Grid container direction="column" className={classes.quizBoxContainer}>
			{info ? (
				<Grid item container>
					<Grid item xs={12} container direction="column">
						<Typography align="center" variant="h6" style={{ marginBottom: '.9em' }}>
							Which song was this Cloud made from?
						</Typography>
					</Grid>
					<Grid item xs={12} lg={8} container direction="column">
						<img item src={info && info.secure_url} className={classes.cloud} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<List>
							{answers.map((a, i) => {
								const thisAnswerChosen = answerIdx == i;
								return (
									<ListItem key={i}>
										<Box
											className={classNames(
												classes.answerChoice,
												isAnswered
													? a.correct
														? classes.correctAnswer
														: thisAnswerChosen ? classes.incorrectAnswer : classes.decoyAnswer
													: classes.decoyAnswer,
											)}
											onClick={() => {
												if (isAnswered) return;
												answerQuestion(gameId, questionIdx, i);
												setTimeout(() => {
													updateQuestionIdx(questionIdx + 1);
												}, 900);
											}}
										>
											<ListItemText>
												<span className={classes.blueTxt}>{`${letters[i]}.) `}</span>
												{`${a.title}`}
											</ListItemText>
										</Box>
									</ListItem>
								);
							})}
						</List>
					</Grid>
				</Grid>
			) : !isSongDetailLoading && !isWordCloudLoading && !areSongLyricsLoading ? (
				<Grid>
					<Typography variant="h3" align="center" className={classes.textPlaceholder}>
						Loading...
					</Typography>
					<LoadingBar loading={isSongDetailLoading || isWordCloudLoading || areSongLyricsLoading} />
				</Grid>
			) : null}
		</Grid>
	);
};

const mapStateQB = (state, ownProps) => {
	const { questions, questionIdx } = ownProps;
	//NOTE: The props here are very similar to SongDetail. Maybe make HOC?
	return {
		song: selectors.getSongFromId(state, questions[questionIdx].songId), // Possibly not needed. Just using for song Id
		clouds: selectors.getCloudsForSong(state, questions[questionIdx].songId),
		isSongDetailLoading: selectors.isSongDetailLoading(state),
		isWordCloudLoading: selectors.isWordCloudLoading(state),
		areSongLyricsLoading: selectors.areSongLyricsLoading(state),
	};
};
const QuizBox = connect(mapStateQB, { fetchSongDetails, answerQuestion })(withWidth()(_QuizBox));

const ArtistGame = (props) => {
	const classes = useStyles();
	const { artistId } = useParams();
	const [ questionIdx, updateQuestionIdx ] = useState(0);
	const { fetchArtistGame, fetchSongDetails, game, artistLoading } = props;
	useEffect(() => {
		if (!(game && game.id)) fetchArtistGame(artistId);
	});
	const { questions = [], artist } = game || {};
	let prevAnswered = false;
	const content =
		questionIdx > questions.length || (!questions.length || !artist) ? (
			<Grid xs={12}>
				<Typography align="center" variant="h1" className={classes.textPlaceholder}>
					{!questions.length || !artist ? 'Loading' : 'Game Over'}
				</Typography>
				<LoadingBar loading={artistLoading} />
			</Grid>
		) : (
			<Fragment>
				<Grid className={classes.scoreBoard} container item xs="11" direction="row" wrap="nowrap">
					{questions.map((question, index) => {
						let children;
						const { answerIdx } = question;
						const answer = question.answers[answerIdx];
						const classesArr = [];
						if (!answer) {
							classesArr.push(classes.unanswered);
							children = (
								<CloudQueue
									onClick={prevAnswered || index == 0 ? () => updateQuestionIdx(index) : null}
								/>
							);
						} else if (answer.correct) {
							classesArr.push(classes.green);
							children = (
								<CloudDone
									onClick={prevAnswered || index == 0 ? () => updateQuestionIdx(index) : null}
								/>
							);
						} else {
							classesArr.push(classes.red);
							children = (
								<CloudOff
									onClick={prevAnswered || index == 0 ? () => updateQuestionIdx(index) : null}
								/>
							);
						}
						prevAnswered = answerIdx == 0 || answerIdx;
						if (index == questionIdx) classesArr.push(classes.currentMiniCloud);
						return (
							<Grid item key={index} className={classNames(classes.miniCloud, ...classesArr)} xs={2}>
								{children}
								<Typography align="center" variant="h6" className={classes.blackTxt}>
									{index + 1}
								</Typography>
							</Grid>
						);
					})}
				</Grid>
				<Grid xs="10" className={classes.quizBoxWrapper}>
					<QuizBox
						questions={questions}
						gameId={game.id}
						questionIdx={questionIdx}
						fetchSongDetails={fetchSongDetails}
						updateQuestionIdx={updateQuestionIdx}
					/>
				</Grid>
			</Fragment>
		);

	return (
		<Grid
			className={classes.artistGamePage}
			container
			direction="row"
			wrap="wrap"
			alignItems="flex-start"
			alignContent="flex-start"
			justify="center"
		>
			{content}
		</Grid>
	);
};

const mapState = (state) => ({
	game: selectors.getArtistGame(state),
	artistLoading: selectors.isArtistLoading(state), //TO-DO: Read from the gameLoading property instead. Need to update sagas/reducers to do that.
});

export default connect(mapState, { searchSongs, setSongSearchTerm, fetchArtistGame, fetchSongDetails })(
	withWidth()(ArtistGame),
);
