import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Grid, Avatar, Box, Button } from "@mui/material";
import CloudDone from "@mui/icons-material/CloudDone";
import CloudQueue from "@mui/icons-material/CloudQueue";
import CloudOff from "@mui/icons-material/CloudOff";

import { makeStyles } from "@mui/styles";
import * as selectors from "../redux/selectors";
import {
	fetchArtistGame,
	fetchSongDetails,
	answerQuestion,
} from "../redux/actions";
import { connect } from "react-redux";
import paths from "../paths";
import { classNames, useWidth } from "../utils";
import FlyWithMe from "../components/FlyWithMe";

const useStyles = makeStyles((theme) => {
	return {
		artistGamePage: {
			minHeight: "91vh", //TO-DO: Why doesn't 100% height work here, but does work on ArtistPage? Content/children?
			width: "100%",
			backgroundColor: theme.palette.primary.main,
			overflow: "hidden",
		},
		artistAvatar: {
			width: "3.3em",
			height: "3.3em",
			margin: "auto",
		},
		artistName: {
			fontSize: "2.4em",
		},
		miniCloud: {
			marginRight: "1.2em",
			cursor: "pointer",
			textAlign: "center",
		},
		currentMiniCloud: {
			backgroundColor: theme.palette.secondary.main,
			borderRadius: "5px",
			padding: ".12em",
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
			width: "100%",
			margin: "auto",
		},
		decoyAnswer: {
			border: `3px solid ${theme.palette.primary.light}`,
		},
		answerChoice: {
			margin: ".6em",
			borderRadius: "21px",
			padding: ".54em",
			cursor: "pointer",
		},
		scoreBoard: {
			overflowX: "scroll",
		},
		textPlaceholder: {
			width: "100%",
		},
		gameOverGrid: {
			marginBottom: ".3em",
		},
		playAgainLink: {
			margin: "1.2em",
			textDecoration: "none",
			color: theme.palette.secondary.main,
		},
		loadingFrame: {
			backgroundColor: "rgba(0, 0, 0, 0.333)",
			zIndex: 1,
			padding: "1.5em",
		},
		countDown: {
			position: "absolute",
			top: "-.45em",
			right: "-.45em",
			color: "rgba(245, 245, 255, 0.555)",
			fontWeight: theme.typography.fontWeightBold,
		},
	};
});
let questionTimer,
	setQuestionTimer = (cb, ms = 1000) => {
		if (questionTimer) {
			clearInterval(questionTimer);
		}
		questionTimer = setInterval(cb, ms);
	};
export const QuizBox = (props) => {
	const {
		question,
		answerQuestion,
		gameId,
		questionIdx,
		updateQuestionIdx,
		answersOnBottomOnly = false,
		isRealQuestion = true,
		customOnClickForAnswerChoices,
		customSeconds,
	} = props;
	const classes = useStyles();
	const [seconds, setSeconds] = useState(customSeconds || 0);
	const { answers, answerIdx, cloud, song } = question || {};
	const { info } = cloud || {};
	const isAnswered = answerIdx === 0 || answerIdx;
	const letters = ["A", "B", "C", "D"];
	const updateQuestionIdxDelayed = (newIdx) => {
		setTimeout(() => {
			updateQuestionIdx(newIdx);
		}, 900);
	};
	useEffect(() => {
		if (isRealQuestion) {
			const { answerIdx } = question;
			const isAnswered = answerIdx === 0 || !!answerIdx;
			if (!isAnswered) {
				setSeconds(10);
				setQuestionTimer(() => {
					setSeconds((s) => {
						const newSeconds = s - 1;
						if (newSeconds < 0) {
							answerQuestion(gameId, questionIdx, -1);
							clearInterval(questionTimer);
							updateQuestionIdxDelayed(questionIdx + 1);
						}
						return newSeconds;
					});
				});
			}
		}
	}, [questionIdx]);
	if (!cloud || !answers) return null;
	return (
		<Grid
			item
			container
			justifyContent="space-evenly"
			className={classes.quizBoxContainer}
		>
			<Grid item xs={12} container direction="column">
				{!isRealQuestion && (
					<Typography
						alignItems="center"
						variant="h6"
						style={{ marginBottom: ".9em" }}
						color="secondary"
					>
						This is a demo to show you what the game will be like.
					</Typography>
				)}
				{isAnswered ? (
					<Typography
						alignItems="center"
						variant="h6"
						style={{ marginBottom: ".9em" }}
					>
						This RapCloud was made from{" "}
						<Link className={classes.blueTxt} to={`/clouds/${song.id}`}>
							{song.title}
						</Link>
					</Typography>
				) : (
					<Typography
						alignItems="center"
						variant="h6"
						style={{ marginBottom: ".9em" }}
					>
						Which song was this RapCloud made from?
					</Typography>
				)}
			</Grid>
			<Grid
				item
				xs={12}
				md={answersOnBottomOnly ? 12 : 7}
				container
				direction="column"
				style={{ position: "relative" }}
			>
				{!isAnswered && (
					<Typography variant="h2" className={classes.countDown}>
						{seconds}
					</Typography>
				)}

				<img src={info && info.secure_url} className={classes.cloud} />
			</Grid>
			<Grid item xs={12} md={answersOnBottomOnly ? 12 : 4}>
				<Grid
					container
					direction="row"
					wrap="wrap"
					justifyContent="space-evenly"
					alignItems="center"
					alignContent="space-around"
					style={{ height: "100%" }}
				>
					{answers.map((a, i) => {
						const thisAnswerChosen = answerIdx === i;
						return (
							<Grid
								item
								key={i}
								xs={12}
								sm={6}
								md={answersOnBottomOnly ? 6 : 12}
							>
								<Box
									className={classNames(
										classes.answerChoice,
										isAnswered
											? a.correct
												? classes.correctAnswer
												: thisAnswerChosen
												? classes.incorrectAnswer
												: classes.decoyAnswer
											: classes.decoyAnswer
									)}
									onClick={() => {
										if (isRealQuestion) {
											if (isAnswered) return;
											answerQuestion(gameId, questionIdx, i);
											updateQuestionIdxDelayed(questionIdx + 1);
										} else {
											customOnClickForAnswerChoices(i, answers[i]);
										}
									}}
								>
									<Typography>
										<span
											className={classes.blueTxt}
										>{`${letters[i]}.) `}</span>
										{`${a.title}`}
									</Typography>
								</Box>
							</Grid>
						);
					})}
				</Grid>
			</Grid>
		</Grid>
	);
};

const ConnectedQuizBox = connect(null, { answerQuestion })(QuizBox);

const ArtistGame = (props) => {
	const classes = useStyles();
	const { fetchSongDetails, game } = props;
	const { questions = [], artist, gameOver, percentageRight } = game || {};
	const [questionIdx, updateQuestionIdx] = useState(0);
	const question = questions[questionIdx] || {};
	const { answerIdx, cloud } = question;
	const isAnswered = answerIdx === 0 || answerIdx;
	const { info } = cloud || {};
	const updateQuestionIdxSafely = (newIdx) => {
		if (newIdx >= questions.length) {
			newIdx = questions.length - 1;
		}
		updateQuestionIdx(newIdx);
	};

	let prevAnswered = false;
	useEffect(() => {
		if (isAnswered) {
			let newIdx = questionIdx + 1;
			let nextQuestion = questions[newIdx];
			let nextQuestionAnswered =
				nextQuestion.answerIdx === 0 || nextQuestion.answerIdx;
			while (nextQuestionAnswered) {
				newIdx++;
				if (newIdx > questions.length - 1) {
					break;
				}
				nextQuestion = questions[newIdx];
				nextQuestionAnswered =
					nextQuestion.answerIdx === 0 || nextQuestion.answerIdx;
			}
			updateQuestionIdxSafely(newIdx);
		}
	}, []);
	useEffect(() => {
		if (!info) {
			const { songId } = question;
			console.log("No info found for song. Fetching details", songId);
			songId && fetchSongDetails(songId);
		}
	}, [questionIdx]);
	const content = (
		<Grid container item xs={12} justifyContent="center">
			{gameOver && (
				<Grid
					container
					item
					justifyContent="center"
					className={classes.gameOverGrid}
					xs={11}
				>
					<Typography
						alignItems="center"
						variant="h5"
						className={classes.blueTxt}
						style={{ width: "100%" }}
					>
						Game Over!
					</Typography>
					<Typography alignItems="center" style={{ width: "100%" }}>
						You got {percentageRight}% of RapClouds on {artist.name}
						Level {game.level}
					</Typography>
					<Typography alignItems="center" style={{ width: "100%" }}>
						{game.nextLevel ? (
							<Button
								variant="contained"
								component={Link}
								to={`/games/${artist.id}/${game.nextLevel}`}
								className={classes.playAgainLink}
							>
								Level {game.nextLevel}
							</Button>
						) : null}
						<Button
							variant="contained"
							component={Link}
							to={paths.play}
							className={classes.playAgainLink}
						>
							New Artist
						</Button>
					</Typography>
				</Grid>
			)}
			<Grid
				className={classes.scoreBoard}
				container
				item
				xs={11}
				direction="row"
				wrap="nowrap"
			>
				{questions.map((question, index) => {
					let children;
					const { answerIdx } = question;
					const isAnswered = answerIdx === 0 || answerIdx;
					const answer = question.answers[answerIdx] || {};
					const classesArr = [];
					if (!isAnswered) {
						classesArr.push(classes.unanswered);
						children = (
							<CloudQueue
								onClick={
									gameOver && (prevAnswered || index === 0)
										? () => updateQuestionIdxSafely(index)
										: null
								}
							/>
						);
					} else if (answer.correct) {
						classesArr.push(classes.green);
						children = (
							<CloudDone
								onClick={
									gameOver && (prevAnswered || index === 0)
										? () => updateQuestionIdxSafely(index)
										: null
								}
							/>
						);
					} else {
						classesArr.push(classes.red);
						children = (
							<CloudOff
								onClick={
									gameOver && (prevAnswered || index === 0)
										? () => updateQuestionIdxSafely(index)
										: null
								}
							/>
						);
					}
					prevAnswered = isAnswered;
					if (index === questionIdx) classesArr.push(classes.currentMiniCloud);
					return (
						<Grid
							item
							key={index}
							className={classNames(classes.miniCloud, ...classesArr)}
							xs={2}
						>
							{children}
							<Typography
								alignItems="center"
								variant="h6"
								className={classes.blackTxt}
							>
								{index + 1}
							</Typography>
						</Grid>
					);
				})}
			</Grid>
			<Grid item xs={10} className={classes.quizBoxWrapper}>
				{!!info || gameOver ? (
					<ConnectedQuizBox
						question={question}
						gameId={game.id}
						questionIdx={questionIdx}
						updateQuestionIdx={updateQuestionIdxSafely}
						gameOver={gameOver}
					/>
				) : (
					<FlyWithMe includeRightZero={false}>
						<Typography
							variant="h3"
							style={{ zIndex: 2, width: "100%" }}
							color="secondary"
						>
							Just getting some things ready for you!
						</Typography>
					</FlyWithMe>
				)}
			</Grid>
		</Grid>
	);

	return content;
};

const gameCoverQuestion = {
	songId: 5967212,
	answers: [
		{
			title: "You will be shown a RapCloud made from a song.",
			songId: 4895355,
			correct: false,
		},
		{
			title: "You will be shown multiple choices like these.",
			songId: 5719172,
			correct: false,
		},
		{
			title: "You will have ten seconds to answer.",
			songId: 2925413,
			correct: false,
		},
		{
			title: "All the above",
			correct: true,
			songId: 5398,
		},
	],
	cloud: {
		artistIds: ["1408", "337", "1408"],
		songIds: ["5398"],
		lyricString:
			" tell me what do you see when youre looking at me on a mission to be what im destined to be ive done been through the pain and the sorrow the struggle its nothing but love im a soldier a rider a ghetto survivor and all the above all the above x7  listen really what do you see when you looking at me? see me come up from nothing see me living my dreams ive done been through the bottom ive done suffered a lot i deserve to be rich heading straight to the top look how i ride for the block look how i rep for the hood i got nothing but love now that i come through the hood getting this fortune and fame money make all of us change the new benz is all white call it john mccain how the hell could you stop me? why in the world would you try? i go hard forever thats just how im designed thats just how i was built see the look in my eyes you take all of this from me and im still gon survive you get truth from me but these rappers gon lie im a part of these streets till the day that i die i wave hi to the haters mad that i finally done made it take a look and you can tell that im destined for greatness   its easy to hate its harder to love me yall dont understand yall quickly to judge me put your foot in my nikes picture you living my life picture you stuck in the cell picture you wasting your life picture you facing a charge picture you beating the odds picture you willing to bleed picture you wearing the scar thank you for making me struggle thank you for making me grind i perfected my hustle tell me the world aint mine youve been seeing me lately im a miracle baby i refuse to lose this what the ghetto done made me i put that on my father trying to hope for tomorrow when i think that i cant i envision obama i envision in diamonds i envision ferraris if the world was perfect all my niggas behind me aint you happy i made it? man im making a statement take a look and you can tell that im destined for greatness    now if im out on the spot or if im out on the block i hustle hard cause its all the same they know they know if you know that grind dont stop because i rose to the top and everybody knows my name maino maino hey im still grinding still hustling no more pain no more suffering my ladies and my shorties and my thugs keep on dancing and shining for love ",
		officialCloud: false,
		private: true,
		_id: "623820ab8dd60e6b82ae252a",
		description: "A RapCloud that you love.",
		settings: {
			colors: ["#64c1ff", "#0091ea", "#0064b7", "#f5f5f5", "#6d6d6d"],
			stopWords: ["and", "but", "the", "to", "if", "it", "of", "at"],
			_id: "623820ab8dd60e6b82ae252b",
			backgroundColor: "#000000",
			collocations: true,
			coloredBackground: true,
			colorFromMask: false,
			contour: false,
			contourColor: "#ffffff",
			contourWidth: "0",
			detectEdges: true,
			downsample: "3",
			height: "200",
			includeNumbers: true,
			maskAsBackground: false,
			maskDesired: false,
			maskId: null,
			private: true,
			repeat: true,
			transparentBackground: false,
			useCustomColors: true,
			useRandomColors: false,
			whiteThreshold: "240",
			width: "400",
		},
		userId: "5fa3017c0a90740a9384abf7",
		inspirationType: "song",
		__v: 0,
		info: {
			access_mode: "public",
			api_key: "419964162721592",
			asset_id: "ee6a43b2c720aa8f7d51c61d34046e0e",
			bytes: 65629,
			created_at: "2022-03-21T06:52:30Z",
			etag: "e9c6a210f6e551bdd4a38b95cd6e8aad",
			format: "png",
			height: 200,
			original_filename: "xGXPSg7idrV1j__eAAAO",
			placeholder: false,
			public_id: "userMadeCloudsDev/rgxymqzmducsbqncyhis",
			resource_type: "image",
			secure_url:
				"https://res.cloudinary.com/rap-clouds/image/upload/v1647845550/userMadeCloudsDev/rgxymqzmducsbqncyhis.png",
			signature: "02e62dd147970d997132d6059967b7e1be73bb03",
			tags: [],
			type: "upload",
			url: "http://res.cloudinary.com/rap-clouds/image/upload/v1647845550/userMadeCloudsDev/rgxymqzmducsbqncyhis.png",
			version: 1647845550,
			version_id: "a606dd06f70c8c85c06c12797b862d91",
			width: 400,
		},
		id: "623820ab8dd60e6b82ae252a",
	},
	song: {
		annotation_count: 13,
		api_path: "/songs/5398",
		artist_names: "Maino (Ft. T-Pain)",
		full_title: "All the Above by Maino (Ft. T-Pain)",
		header_image_thumbnail_url:
			"https://images.genius.com/ca3460c5a83c8975c4cffa0ffa364442.300x300x1.jpg",
		header_image_url:
			"https://images.genius.com/ca3460c5a83c8975c4cffa0ffa364442.1000x1000x1.jpg",
		id: 5398,
		lyrics_owner_id: 8534,
		lyrics_state: "complete",
		path: "/Maino-all-the-above-lyrics",
		pyongs_count: 11,
		song_art_image_thumbnail_url:
			"https://images.genius.com/ca3460c5a83c8975c4cffa0ffa364442.300x300x1.jpg",
		song_art_image_url:
			"https://images.genius.com/ca3460c5a83c8975c4cffa0ffa364442.1000x1000x1.jpg",
		stats: {
			accepted_annotations: 12,
			contributors: 30,
			iq_earners: 30,
			transcribers: 0,
			unreviewed_annotations: 0,
			verified_annotations: 0,
			hot: false,
			pageviews: 71501,
		},
		title: "All the Above",
		title_with_featured: "All the Above (Ft. T-Pain)",
		url: "https://genius.com/Maino-all-the-above-lyrics",
		primary_artist: {
			alternate_names: [],
			_id: "6238233f8dd60e6b82ae2549",
			api_path: "/artists/1408",
			header_image_url:
				"https://images.genius.com/045fdbaba8793b14cab87fc28c21876e.580x580x1.jpg",
			id: 1408,
			image_url:
				"https://images.genius.com/045fdbaba8793b14cab87fc28c21876e.580x580x1.jpg",
			is_meme_verified: false,
			is_verified: false,
			name: "Maino",
			url: "https://genius.com/artists/Maino",
		},
		normalizedLyrics:
			" tell me what do you see when youre looking at me on a mission to be what im destined to be ive done been through the pain and the sorrow the struggle its nothing but love im a soldier a rider a ghetto survivor and all the above all the above x7  listen really what do you see when you looking at me? see me come up from nothing see me living my dreams ive done been through the bottom ive done suffered a lot i deserve to be rich heading straight to the top look how i ride for the block look how i rep for the hood i got nothing but love now that i come through the hood getting this fortune and fame money make all of us change the new benz is all white call it john mccain how the hell could you stop me? why in the world would you try? i go hard forever thats just how im designed thats just how i was built see the look in my eyes you take all of this from me and im still gon survive you get truth from me but these rappers gon lie im a part of these streets till the day that i die i wave hi to the haters mad that i finally done made it take a look and you can tell that im destined for greatness   its easy to hate its harder to love me yall dont understand yall quickly to judge me put your foot in my nikes picture you living my life picture you stuck in the cell picture you wasting your life picture you facing a charge picture you beating the odds picture you willing to bleed picture you wearing the scar thank you for making me struggle thank you for making me grind i perfected my hustle tell me the world aint mine youve been seeing me lately im a miracle baby i refuse to lose this what the ghetto done made me i put that on my father trying to hope for tomorrow when i think that i cant i envision obama i envision in diamonds i envision ferraris if the world was perfect all my niggas behind me aint you happy i made it? man im making a statement take a look and you can tell that im destined for greatness    now if im out on the spot or if im out on the block i hustle hard cause its all the same they know they know if you know that grind dont stop because i rose to the top and everybody knows my name maino maino hey im still grinding still hustling no more pain no more suffering my ladies and my shorties and my thugs keep on dancing and shining for love ",
		album: {
			api_path: "/albums/5407",
			cover_art_url:
				"https://images.genius.com/ca3460c5a83c8975c4cffa0ffa364442.1000x1000x1.jpg",
			full_title: "If Tomorrow Comes... by Maino",
			id: 5407,
			name: "If Tomorrow Comes...",
			url: "https://genius.com/albums/Maino/If-tomorrow-comes",
			artist: {
				alternate_names: [],
				_id: "6238233f8dd60e6b82ae2547",
				api_path: "/artists/1408",
				header_image_url:
					"https://images.genius.com/045fdbaba8793b14cab87fc28c21876e.580x580x1.jpg",
				id: 1408,
				image_url:
					"https://images.genius.com/045fdbaba8793b14cab87fc28c21876e.580x580x1.jpg",
				is_meme_verified: false,
				is_verified: false,
				name: "Maino",
				url: "https://genius.com/artists/Maino",
			},
		},
		media: [
			{
				native_uri: "spotify:track:1z667LebVh3DtYNrVJEao0",
				provider: "spotify",
				type: "audio",
				url: "https://open.spotify.com/track/1z667LebVh3DtYNrVJEao0",
			},
			{
				provider: "youtube",
				start: 0,
				type: "video",
				url: "http://www.youtube.com/watch?v=YEYxOPtQqWw",
			},
		],
		song_relationships: [
			{
				relationship_type: "samples",
				type: "samples",
				songs: [],
			},
			{
				relationship_type: "sampled_in",
				type: "sampled_in",
				songs: [
					{
						annotation_count: 1,
						api_path: "/songs/524999",
						artist_names: "Eko Fresh (Ft. Ado Kojo)",
						full_title: "Alles im Lot by Eko Fresh (Ft. Ado Kojo)",
						header_image_thumbnail_url:
							"https://images.genius.com/24403d659a9a47578d67cc4a6e4151f5.300x225x1.jpg",
						header_image_url:
							"https://images.genius.com/24403d659a9a47578d67cc4a6e4151f5.480x360x1.jpg",
						id: 524999,
						lyrics_owner_id: 273537,
						lyrics_state: "complete",
						path: "/Eko-fresh-alles-im-lot-lyrics",
						pyongs_count: null,
						song_art_image_thumbnail_url:
							"https://images.genius.com/24403d659a9a47578d67cc4a6e4151f5.300x225x1.jpg",
						song_art_image_url:
							"https://images.genius.com/24403d659a9a47578d67cc4a6e4151f5.480x360x1.jpg",
						stats: {
							unreviewed_annotations: 0,
							hot: false,
						},
						title: "Alles im Lot",
						title_with_featured: "Alles im Lot (Ft. Ado Kojo)",
						url: "https://genius.com/Eko-fresh-alles-im-lot-lyrics",
						primary_artist: {
							api_path: "/artists/12455",
							header_image_url:
								"https://images.genius.com/9b416efb6f9189510f6a66a2fc417d02.525x280x1.jpg",
							id: 12455,
							image_url:
								"https://images.genius.com/6af0d023f12750839c86675eb477af97.1000x1000x1.jpg",
							is_meme_verified: false,
							is_verified: false,
							name: "Eko Fresh",
							url: "https://genius.com/artists/Eko-fresh",
						},
					},
				],
			},
			{
				relationship_type: "interpolates",
				type: "interpolates",
				songs: [],
			},
			{
				relationship_type: "interpolated_by",
				type: "interpolated_by",
				songs: [],
			},
			{
				relationship_type: "cover_of",
				type: "cover_of",
				songs: [],
			},
			{
				relationship_type: "covered_by",
				type: "covered_by",
				songs: [],
			},
			{
				relationship_type: "remix_of",
				type: "remix_of",
				songs: [],
			},
			{
				relationship_type: "remixed_by",
				type: "remixed_by",
				songs: [
					{
						annotation_count: 1,
						api_path: "/songs/30352",
						artist_names: "Maino (Ft. Jeezy & T-Pain)",
						full_title: "All the Above (Remix) by Maino (Ft. Jeezy & T-Pain)",
						header_image_thumbnail_url:
							"https://images.genius.com/045fdbaba8793b14cab87fc28c21876e.300x300x1.jpg",
						header_image_url:
							"https://images.genius.com/045fdbaba8793b14cab87fc28c21876e.580x580x1.jpg",
						id: 30352,
						lyrics_owner_id: 50,
						lyrics_state: "complete",
						path: "/Maino-all-the-above-remix-lyrics",
						pyongs_count: null,
						song_art_image_thumbnail_url:
							"https://images.genius.com/045fdbaba8793b14cab87fc28c21876e.300x300x1.jpg",
						song_art_image_url:
							"https://images.genius.com/045fdbaba8793b14cab87fc28c21876e.580x580x1.jpg",
						stats: {
							unreviewed_annotations: 0,
							hot: false,
							pageviews: 5405,
						},
						title: "All the Above (Remix)",
						title_with_featured: "All the Above (Remix) (Ft. Jeezy & T-Pain)",
						url: "https://genius.com/Maino-all-the-above-remix-lyrics",
						primary_artist: {
							api_path: "/artists/1408",
							header_image_url:
								"https://images.genius.com/045fdbaba8793b14cab87fc28c21876e.580x580x1.jpg",
							id: 1408,
							image_url:
								"https://images.genius.com/045fdbaba8793b14cab87fc28c21876e.580x580x1.jpg",
							is_meme_verified: false,
							is_verified: false,
							name: "Maino",
							url: "https://genius.com/artists/Maino",
						},
					},
				],
			},
			{
				relationship_type: "live_version_of",
				type: "live_version_of",
				songs: [],
			},
			{
				relationship_type: "performed_live_as",
				type: "performed_live_as",
				songs: [],
			},
		],
		verified_annotations_by: [],
		verified_contributors: [],
		verified_lyrics_by: [],
		_id: "623820668dd60e6b82ae2406",
		featured_artists: [
			{
				alternate_names: [],
				_id: "6238233f8dd60e6b82ae2548",
				api_path: "/artists/337",
				header_image_url:
					"https://images.genius.com/5f2e9a0fce5f6eb6e7ab605d69e880ee.824x470x1.jpg",
				id: 337,
				image_url:
					"https://images.genius.com/6efed4f2f043ca2d708512a157481569.720x720x1.jpg",
				is_meme_verified: false,
				is_verified: true,
				name: "T-Pain",
				url: "https://genius.com/artists/T-pain",
				iq: 418,
			},
		],
		producer_artists: [
			{
				alternate_names: [],
				_id: "6238233f8dd60e6b82ae254a",
				api_path: "/artists/45255",
				header_image_url:
					"https://images.genius.com/f51f038710d0c1c5ef2d572c9a42da64.400x400x1.jpg",
				id: 45255,
				image_url:
					"https://images.genius.com/f51f038710d0c1c5ef2d572c9a42da64.400x400x1.jpg",
				is_meme_verified: false,
				is_verified: false,
				name: "Nard & B",
				url: "https://genius.com/artists/Nard-and-b",
			},
			{
				alternate_names: [],
				_id: "6238233f8dd60e6b82ae254b",
				api_path: "/artists/1954",
				header_image_url:
					"https://images.genius.com/5cca6bc6b1297475c8bd2a4df6411c97.1000x1000x1.jpg",
				id: 1954,
				image_url:
					"https://images.genius.com/5cca6bc6b1297475c8bd2a4df6411c97.1000x1000x1.jpg",
				is_meme_verified: true,
				is_verified: true,
				name: "Just Blaze",
				url: "https://genius.com/artists/Just-blaze",
				iq: 688,
			},
		],
		writer_artists: [
			{
				alternate_names: [],
				_id: "6238233f8dd60e6b82ae254c",
				api_path: "/artists/1408",
				header_image_url:
					"https://images.genius.com/045fdbaba8793b14cab87fc28c21876e.580x580x1.jpg",
				id: 1408,
				image_url:
					"https://images.genius.com/045fdbaba8793b14cab87fc28c21876e.580x580x1.jpg",
				is_meme_verified: false,
				is_verified: false,
				name: "Maino",
				url: "https://genius.com/artists/Maino",
			},
			{
				alternate_names: [],
				_id: "6238233f8dd60e6b82ae254d",
				api_path: "/artists/337",
				header_image_url:
					"https://images.genius.com/5f2e9a0fce5f6eb6e7ab605d69e880ee.824x470x1.jpg",
				id: 337,
				image_url:
					"https://images.genius.com/6efed4f2f043ca2d708512a157481569.720x720x1.jpg",
				is_meme_verified: false,
				is_verified: true,
				name: "T-Pain",
				url: "https://genius.com/artists/T-pain",
				iq: 418,
			},
		],
		__v: 3,
		apple_music_id: "320422815",
		apple_music_player_url: "https://genius.com/songs/5398/apple_music_player",
		description: {
			dom: {
				tag: "root",
				children: [
					{
						tag: "p",
						children: [
							"This song appears as the second single from Maino’s debut album, ",
							{
								tag: "em",
								children: ["If Tomorrow Comes"],
							},
							". The first single was ",
							{
								tag: "a",
								attributes: {
									href: "https://genius.com/Maino-hi-hater-lyrics",
									rel: "noopener",
								},
								data: {
									api_path: "/songs/30350",
								},
								children: ["“Hi Hater”"],
							},
							".",
						],
					},
					"",
					{
						tag: "p",
						children: [
							" “All The Above” was produced by Just Blaze (and co-produced by Nard & B), the producer of T.I.’s song “Live Your Life”. Both songs have similar elements including the lead synthesizers, drum pattern, and violins but in a different key and different chords.",
						],
					},
				],
			},
		},
		embed_content:
			"<div id='rg_embed_link_5398' class='rg_embed_link' data-song-id='5398'>Read <a href='https://genius.com/Maino-all-the-above-lyrics'>“All the Above” by Maino</a> on Genius</div> <script crossorigin src='//genius.com/songs/5398/embed.js'></script>",
		featured_video: false,
		lyrics_placeholder_reason: null,
		recording_location: null,
		release_date: "2009-02-17",
		release_date_for_display: "February 17, 2009",
		ytData: {
			_id: "6238233f8dd60e6b82ae254e",
			title: "Maino ft. T-Pain - All of the Above",
			author_name: "runefr3ak41",
			author_url: "https://www.youtube.com/user/runefr3ak41",
			type: "video",
			height: 150,
			width: 200,
			version: "1.0",
			provider_name: "YouTube",
			provider_url: "https://www.youtube.com/",
			thumbnail_height: 360,
			thumbnail_width: 480,
			thumbnail_url: "https://i.ytimg.com/vi/YEYxOPtQqWw/hqdefault.jpg",
			html: '<iframe width="200" height="150" src="https://www.youtube.com/embed/YEYxOPtQqWw?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
		},
		lyrics:
			"[Hook: T-Pain]\nTell me what do you see, when you're looking at me\nOn a mission to be, what I'm destined to be\nI've done been through the pain and the sorrow\nThe struggle it's nothing but love\nI'm a soldier a rider a ghetto survivor and all the above\nAll the above (x7)\n\n[Verse One: Maino]\nListen! Really what do you see, when you looking at me?\nSee me come up from nothing, see me living my dreams\nI've done been through the bottom, I've done suffered a lot\nI deserve to be rich, heading straight to the top\nLook how I ride for the block, look how I rep for the hood\nI got nothing but love, now that I come through the hood\nGetting this fortune and fame, money make all of us change\nThe new Benz is all white, call it John McCain\nHow the hell could you stop me? Why in the world would you try?\nI go hard forever, that's just how I'm designed\nThat's just how I was built, see the look in my eyes\nYou take all of this from me, and I'm still gon' survive\nYou get truth from me, but these rappers gon' lie\nI'm a part of these streets, till the day that I die\nI wave hi to the haters, mad that I finally done made it\nTake a look, and you can tell that I'm destined for greatness\n\n[Hook: T-Pain]\n\n[Verse Two: Maino]\nIt's easy to hate, it's harder to love me\nY'all don't understand, y'all quickly to judge me\nPut your foot in my Nike's, picture you living my life\nPicture you stuck in the cell, picture you wasting your life\nPicture you facing a charge, picture you beating the odds\nPicture you willing to bleed, picture you wearing the scar\nThank you for making me struggle, thank you for making me grind\nI perfected my hustle, tell me the world ain't mine\nYou've been seeing me lately, I'm a miracle baby\nI refuse to lose, this what the ghetto done made me\nI put that on my father, trying to hope for tomorrow\nWhen I think that I can't, I envision Obama\nI envision in diamonds, I envision Ferrari's\nIf the world was perfect, all my niggas behind me\nAin't you happy I made it? Man I'm making a statement\nTake a look, and you can tell that I'm destined for greatness\n\n\n[Hook: T-Pain]\n\n[Bridge: T-Pain]\nNow if I'm out on the spot\nOr if I'm out on the block\nI hustle hard cause it's all the same (They know, they know)\nIf you know that grind don't stop\nBecause I rose to the top\nAnd everybody knows my name (Maino, Maino)\nHey! I'm still grinding, still hustling\nNo more pain, no more suffering\nMy ladies and my shorties and my thugs\nKeep on dancing and shining for love\n\n[Hook: T-Pain]",
	},
};

const GameCover = (props) => {
	const { gameOver } = props;
	const [isUserReady, setUserReadiness] = useState(false);
	// const [dontShowTutorial, setShowTutorialOrNot] = useState(false); //TO-DO: Make them not have to answer the demo question
	const [demoAnswerIdx, setDemoAnswerIdx] = useState(null);
	gameCoverQuestion.answerIdx = demoAnswerIdx;
	return gameOver || isUserReady ? (
		<ConnectedArtistGame></ConnectedArtistGame>
	) : (
		<Grid
			id="gameCover"
			container
			justifyContent="center"
			alignItems="center"
			style={{ paddingTop: "2.22em" }}
		>
			<Grid item xs={10}>
				<QuizBox
					question={gameCoverQuestion}
					// gameId={game.id} //Should'nt need this
					// questionIdx={questionIdx} //Shouldn't need this
					updateQuestionIdx={() => null}
					gameOver={false}
					isRealQuestion={false}
					customSeconds={10}
					customOnClickForAnswerChoices={(answerIdx, answer) => {
						setDemoAnswerIdx(answerIdx);
						const { correct } = answer;
						if (correct) {
							setTimeout(() => {
								setUserReadiness(true);
							}, 1111);
						} else {
							setTimeout(() => {
								setDemoAnswerIdx(null);
							}, 333);
						}
					}}
				></QuizBox>
			</Grid>
		</Grid>
	);
	//Grid
	//RapCloud Question - Maino, All the Above
	//Choices => Explanation
	//A. You will be shown a RapCloud made from a song. But which song?
	//B. You will be shown multiple choices, (A, B, C, D) and you should choose one
	//C. You will have ten seconds to answer.
	//D. All the above
};

const mapState = (state) => ({
	game: selectors.getArtistGame(state),
	artist: selectors.getCurrentArtist(state),
	artistLoading: selectors.isArtistLoading(state), //TO-DO: Read from the gameLoading property instead. Need to update sagas/reducers to do that.
	isSongDetailLoading: selectors.isSongDetailLoading(state),
	isWordCloudLoading: selectors.isWordCloudLoading(state),
	areSongLyricsLoading: selectors.areSongLyricsLoading(state),
});

const ConnectedArtistGame = connect(mapState, { fetchSongDetails })(ArtistGame);

const _ArtistGameLoadingGate = (props) => {
	const { game, fetchArtistGame, artist } = props;
	console.log(game);
	const { artistId, level } = useParams();
	const { gameId = null, gameOver } = game || {};
	const classes = useStyles();
	const width = useWidth();

	useEffect(() => {
		if (!gameId) fetchArtistGame(artistId, level);
	}, [artistId, level]);
	const { image_url, name } = artist;
	return (
		<Grid
			className={classes.artistGamePage}
			container
			direction="row"
			wrap="wrap"
			alignItems="flex-start"
			alignContent="flex-start"
			justifyContent="center"
		>
			{!!game ? (
				<GameCover gameOver={gameOver} />
			) : (
				<FlyWithMe>
					<Grid
						item
						container
						justifyContent="center"
						direction="column"
						spacing={2}
						xs={12}
						className={classes.loadingFrame}
					>
						<Typography
							alignItems="center"
							variant="h4"
							style={{ marginBottom: ".5em" }}
						>
							{name}
						</Typography>
						<Avatar
							item
							alt={name}
							src={image_url}
							imgProps={null}
							className={classes.artistAvatar}
							style={
								width === "xs"
									? { width: "50vw", height: "50vw" }
									: { width: "50vh", height: "50vh" }
							}
						/>
						<Typography
							alignItems="center"
							variant="h5"
							style={{ marginTop: ".5em" }}
						>
							Level {level}
						</Typography>
					</Grid>
				</FlyWithMe>
			)}
		</Grid>
	);
};
export default connect(mapState, { fetchArtistGame })(_ArtistGameLoadingGate);
