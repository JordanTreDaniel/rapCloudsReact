import React, { useEffect } from 'react';
import { Redirect, useParams, Link } from 'react-router-dom';
import {
	Typography,
	AppBar,
	Toolbar,
	Grid,
	Avatar,
	Tooltip,
	LinearProgress,
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	IconButton,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { fetchSongDetails } from '../redux/actions';
import { connect } from 'react-redux';
import paths from '../paths';
import LoadingCloud from './LoadingCloud';
import BackButton from './BackButton';
import LoadingBar from './LoadingBar';

const useStyles = makeStyles((theme) => {
	return {
		songDetailContainer: {
			height: '100%',
			backgroundColor: theme.palette.primary.main,
			overflow: 'hidden',
		},
		buttonBox: {
			display: 'flex',
		},
		toolBar: {
			display: 'flex',
			justifyContent: 'space-between',
			backgroundColor: theme.palette.primary.light,
		},
		artistBubbles: {
			display: 'flex',
			justifyContent: 'space-evenly',
		},
		leftBubbles: {
			display: 'flex',
			justifyContent: 'space-evenly',
		},
		lyrics: {
			whiteSpace: 'pre-line',
			textAlign: 'center',
		},
		mainContentChild: { width: '100%' },
		loadingDiv: {
			width: '100%',
			'& > * + *': {
				marginTop: theme.spacing(2),
			},
			marginTop: '40%',
		},
		wordCloud: {
			width: '100%',
			margin: 'auto',
		},
		songHeader: {
			display: 'flex',
			flexFlow: 'column wrap',
			alignContent: 'center',
			textAlign: 'center',
		},
		mainContent: {
			overflowY: 'scroll',
			width: '100%',
			height: '100%',
			paddingBottom: '6em',
		},
		header: {
			color: theme.palette.secondary.light,
			fontWeight: 600,
		},
		wordCloudPaper: {
			padding: '1em',
			margin: '1em',
		},
		lyricsPaper: {
			padding: '1em',
			margin: '1em',
		},
		sectionHeader: {
			textAlign: 'center',
			fontWeight: 600,
			color: theme.palette.secondary.light,
		},
		headerAction: {
			backgroundColor: theme.palette.secondary.light,
			color: theme.palette.secondary.contrastText,
			marginLeft: '1em',
			'&:hover': {
				backgroundColor: theme.palette.secondary.light,
				color: theme.palette.secondary.contrastText,
			},
		},
	};
});

const SongDetail = (props) => {
	const classes = useStyles();
	const { song, fetchSongDetails, isSongDetailLoading, isWordCloudLoading } = props;
	const { songId } = useParams();
	const [ lyricsExpanded, setLyricsExpanded ] = React.useState(null);
	const toggleLyricsExpanded = () => setLyricsExpanded(!lyricsExpanded);
	useEffect(
		() => {
			if (songId) {
				fetchSongDetails(songId);
			}
		},
		[ songId ],
	);
	if (!songId) return <Redirect to={paths.search} />;
	if (!song) return null;

	const { full_title, path, writer_artists, primary_artist, lyrics, encodedCloud } = song;
	const artists = writer_artists ? [ ...writer_artists ] : primary_artist ? [ primary_artist ] : [];
	const [ briefedTitle, restOfTitle ] = full_title.split('by');
	return (
		<Grid className={classes.songDetailContainer}>
			<AppBar color="inherit" position="static">
				<Toolbar className={classes.toolBar}>
					<div className={classes.leftBubbles}>
						<BackButton />
						<Tooltip placement="bottom" title={`See ${briefedTitle} on Genius`}>
							<a href={`https://genius.com${path}`} alt={`${briefedTitle} on Genius`} target="_blank">
								<Avatar src="https://pbs.twimg.com/profile_images/885222003174551552/cv3KtGVS_400x400.jpg" />
							</a>
						</Tooltip>
					</div>

					<div className={classes.artistBubbles}>
						{artists.map((artist, idx) => {
							return (
								<Tooltip placement="bottom" title={`See ${artist.name}`} key={idx}>
									<Link to={`/cloudMakers/${artist.id}`}>
										<Avatar src={artist.header_image_url} alt={`Link to ${artist.name}'s page`} />
									</Link>
								</Tooltip>
							);
						})}
					</div>
				</Toolbar>
			</AppBar>
			<Grid className={classes.mainContent} container>
				<LoadingBar loading={isSongDetailLoading} />
				<Grid item xs={12}>
					<div className={classes.songHeader}>
						<Typography variant="h3" className={classes.header}>
							{briefedTitle}
						</Typography>
						<Typography variant="small" className={classes.header}>
							{`by ${restOfTitle}`}
						</Typography>
					</div>
				</Grid>
				<Grid item sm={12} md={6} classes={{ root: classes.mainContentChild }}>
					<Paper className={classes.wordCloudPaper}>
						<LoadingBar loading={isWordCloudLoading} />
						<Typography variant="h3" classes={{ root: classes.sectionHeader }}>
							Cloud
						</Typography>
						<img
							src={
								encodedCloud ? (
									`data:image/png;base64, ${encodedCloud}`
								) : (
									`${process.env.PUBLIC_URL}/rapClouds.png`
								)
							}
							alt={'Rap Cloud'}
							className={classes.wordCloud}
						/>
					</Paper>
				</Grid>
				<Grid item sm={12} md={6} classes={{ root: classes.mainContentChild }}>
					<Paper className={classes.lyricsPaper}>
						<LoadingBar loading={false} /> {/* For spacing */}
						<Typography variant="h3" classes={{ root: classes.sectionHeader }}>
							Lyrics
							<IconButton className={classes.headerAction} onClick={toggleLyricsExpanded}>
								<AddIcon />
							</IconButton>
						</Typography>
						{lyricsExpanded && (
							<Typography variant="body1" classes={{ root: classes.lyrics }}>
								{lyrics}
							</Typography>
						)}
					</Paper>
				</Grid>
			</Grid>
		</Grid>
	);
};

const mapState = (state) => ({
	song: selectors.getCurrentSong(state),
	isSongDetailLoading: selectors.isSongDetailLoading(state),
	isWordCloudLoading: selectors.isWordCloudLoading(state),
});

export default connect(mapState, { fetchSongDetails })(SongDetail);
