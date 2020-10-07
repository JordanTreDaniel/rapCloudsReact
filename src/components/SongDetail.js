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
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { fetchSongDetails } from '../redux/actions';
import { connect } from 'react-redux';
import paths from '../paths';
import LoadingCloud from './LoadingCloud';
import BackButton from './BackButton';

const useStyles = makeStyles((theme) => {
	return {
		songDetailContainer: {
			height: '100%',
			backgroundColor: theme.palette.primary.main,
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
		mainContentChild: {},
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
		},
		mainContent: {
			overflowY: 'scroll',
			width: '100%',
			height: '100%',
		},
		header: {
			color: theme.palette.text.secondary,
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
	};
});

const SongDetail = (props) => {
	const classes = useStyles();
	const { song, fetchSongDetails, isSongDetailLoading, isWordCloudLoading } = props;
	const { songId } = useParams();
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
						<Typography variant="h3" classes={{ root: classes.lyrics }}>
							Cloud
						</Typography>
						{isWordCloudLoading ? (
							<LoadingCloud />
						) : isSongDetailLoading || !lyrics ? null : (
							<img
								src={`data:image/png;base64, ${encodedCloud}`}
								alt={'Rap Cloud'}
								className={classes.wordCloud}
							/>
						)}
					</Paper>
				</Grid>
				<Grid item sm={12} md={6} classes={{ root: classes.mainContentChild }}>
					<Paper className={classes.lyricsPaper}>
						<Accordion>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography variant="h3" classes={{ root: classes.lyrics }}>
									Lyrics
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography variant="body1" classes={{ root: classes.lyrics }}>
									{lyrics}
								</Typography>
							</AccordionDetails>
						</Accordion>
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
