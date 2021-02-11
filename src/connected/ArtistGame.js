import React, { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
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
	Button,
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
			border: `3px solid ${theme.palette.primary.light}`,
		},
		answerChoice: {
			margin: '.6em',
			borderRadius: '21px',
			padding: '.54em',
			cursor: 'pointer',
		},
		scoreBoard: {
			overflowX: 'scroll',
		},
		textPlaceholder: {
			width: '100%',
		},
		gameOverGrid: {
			marginBottom: '.3em',
		},
		playAgainLink: {
			margin: '1.2em',
			textDecoration: 'none',
			color: theme.palette.secondary.main,
		},
	};
});

export const QuizBox = (props) => {
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
		gameOver,
		cloud,
		answersOnBottomOnly = false,
	} = props;
	const question = questions[questionIdx];
	const classes = useStyles();
	const { answers, answerIdx } = question || {};
	const { info } = cloud || {};
	const isAnswered = answerIdx == 0 || answerIdx;
	const letters = [ 'A', 'B', 'C', 'D' ];
	useEffect(() => {
		let newIdx = questionIdx + 1;
		if (isAnswered) {
			let nextQuestion = questions[newIdx];
			let nextQuestionAnswered = nextQuestion.answerIdx == 0 || nextQuestion.answerIdx;
			while (nextQuestionAnswered) {
				newIdx++;
				if (newIdx > questions.length - 1) {
					newIdx--;
					break;
				}
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
			const secondQuestion = questions[questionIdx + 1];
			if (secondQuestion) {
				fetchSongDetails(secondQuestion.songId);
			}
			const thirdQuestion = questions[questionIdx + 2];
			if (thirdQuestion) {
				fetchSongDetails(thirdQuestion.songId);
			}
		},
		[ questionIdx ],
	);

	return (
		<Grid container direction="column" className={classes.quizBoxContainer}>
			{info ? (
				<Grid item container justify="space-evenly">
					<Grid item xs={12} container direction="column">
						{isAnswered ? (
							<Typography align="center" variant="h6" style={{ marginBottom: '.9em' }}>
								This RapCloud was made from{' '}
								<Link className={classes.blueTxt} to={`/clouds/${song.id}`}>
									{song.title}
								</Link>
							</Typography>
						) : (
							<Typography align="center" variant="h6" style={{ marginBottom: '.9em' }}>
								Which song was this RapCloud made from?
							</Typography>
						)}
					</Grid>
					<Grid item xs={12} md={answersOnBottomOnly ? 12 : 7} container direction="column">
						<img src={info && info.secure_url} className={classes.cloud} />
					</Grid>
					<Grid item xs={12} md={answersOnBottomOnly ? 12 : 4}>
						<Grid
							container
							direction="row"
							wrap="wrap"
							justify="space-evenly"
							alignItems="center"
							alignContent="space-around"
							style={{ height: '100%' }}
						>
							{answers.map((a, i) => {
								const thisAnswerChosen = answerIdx == i;
								return (
									<Grid item key={i} xs={12} sm={6} md={answersOnBottomOnly ? 6 : 12}>
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
											<Typography>
												<span className={classes.blueTxt}>{`${letters[i]}.) `}</span>
												{`${a.title}`}
											</Typography>
										</Box>
									</Grid>
								);
							})}
						</Grid>
					</Grid>
				</Grid>
			) : isSongDetailLoading || isWordCloudLoading || areSongLyricsLoading ? (
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
	const question = questions[questionIdx] || {};
	const { songId } = question;
	//NOTE: The props here are very similar to SongDetail. Maybe make HOC?
	return {
		song: selectors.getSongFromId(state, songId), // Possibly not needed. Just using for song Id
		cloud: selectors.getOfficalCloudForSong(state, songId),
		isSongDetailLoading: selectors.isSongDetailLoading(state),
		isWordCloudLoading: selectors.isWordCloudLoading(state),
		areSongLyricsLoading: selectors.areSongLyricsLoading(state),
	};
};

const ConnectedQuizBox = connect(mapStateQB, { fetchSongDetails, answerQuestion })(withWidth()(QuizBox));

const ArtistGame = (props) => {
	const classes = useStyles();
	const { artistId } = useParams();
	const [ questionIdx, updateQuestionIdx ] = useState(0);
	const { fetchArtistGame, fetchSongDetails, game, artistLoading } = props;
	useEffect(() => {
		if (!(game && game.id)) fetchArtistGame(artistId);
	});
	const { questions = [], artist } = game || {};
	let prevAnswered = false,
		correctAnswers = 0,
		incorrectAnswers = 0;
	questions.forEach((question) => {
		const { answerIdx } = question;
		if (answerIdx !== 0 && !answerIdx) {
			return;
		}
		const answer = question.answers[answerIdx];
		if (answer.correct) {
			correctAnswers++;
		} else {
			incorrectAnswers++;
		}
	});
	const gameOver = correctAnswers + incorrectAnswers === questions.length;
	const content =
		!questions.length || !artist ? (
			<Grid xs={12}>
				<Typography align="center" variant="h1" className={classes.textPlaceholder}>
					{!questions.length || !artist ? 'Loading' : null}
				</Typography>
				<LoadingBar loading={artistLoading} />
			</Grid>
		) : (
			<Fragment>
				{gameOver && (
					<Grid container item justify="center" className={classes.gameOverGrid} xs={11}>
						<Typography align="center" variant="h5" className={classes.blueTxt} style={{ width: '100%' }}>
							Game Over!
						</Typography>
						<Typography align="center" style={{ width: '100%' }}>
							You got {correctAnswers} out of {questions.length} of {artist.name} RapClouds right!
						</Typography>
						<Typography align="center" style={{ width: '100%' }}>
							That's {correctAnswers * 100 / questions.length}%!
						</Typography>
						<Typography align="center" style={{ width: '100%' }}>
							<Button
								variant="contained"
								component={Link}
								to={paths.play}
								className={classes.playAgainLink}
							>
								Play Again?
							</Button>
						</Typography>
					</Grid>
				)}
				<Grid className={classes.scoreBoard} container item xs={11} direction="row" wrap="nowrap">
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
				<Grid item xs={10} className={classes.quizBoxWrapper}>
					<ConnectedQuizBox
						questions={questions}
						gameId={game.id}
						questionIdx={questionIdx}
						fetchSongDetails={fetchSongDetails}
						updateQuestionIdx={updateQuestionIdx}
						gameOver={gameOver}
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
