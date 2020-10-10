import React, { useEffect } from 'react';
import { Redirect, useParams, Link } from 'react-router-dom';
import { Typography, AppBar, Toolbar, Grid, Avatar, Tooltip, Paper, IconButton, withWidth } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import NewTabIcon from '@material-ui/icons/AddToPhotos';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { fetchSongDetails } from '../redux/actions';
import { connect } from 'react-redux';
import paths from '../paths';
import { base64InNewTab } from '../utils';
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
			position: 'relative',
			paddingBottom: '3em',
			backgroundColor: theme.palette.primary.main,
		},
		lyricsPaper: {
			padding: '1em',
			margin: '1em',
			backgroundColor: theme.palette.primary.main,
		},
		sectionHeader: {
			textAlign: 'center',
			fontWeight: 600,
			color: theme.palette.secondary.light,
		},
		headerAction: {
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.light,
			marginLeft: '.5em',
			margin: '.5em',
			'& a': {
				textDecoration: 'none',
				color: theme.palette.secondary.light,
				backgroundColor: theme.palette.primary.dark,
			},
			'&:hover': {
				backgroundColor: theme.palette.secondary.light,
				color: theme.palette.primary.dark,
				'& a': {
					textDecoration: 'none',
					backgroundColor: theme.palette.secondary.light,
					color: theme.palette.primary.dark,
				},
			},
		},
		headerActionLink: { borderRadius: '50%' },
		cloudActions: {
			backgroundColor: theme.palette.primary.light,
			display: 'flex',
			flexFlow: 'row nowrap',
			position: 'absolute',
		},
		cloudActionsTop: {
			top: '3em',
			left: '5em',
		},
		cloudActionsBottom: {
			bottom: '2em',
			left: '5em',
		},
	};
});

const SongDetail = (props) => {
	const classes = useStyles();
	const { song, fetchSongDetails, isSongDetailLoading, isWordCloudLoading, width } = props;
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
	const renderCloudActions = (place) => {
		const conditionsPassed = place === 'bottom' ? width === 'xs' : width !== 'xs';
		return (
			<Paper
				elevation={12}
				id="cloudActions"
				className={` ${classes.cloudActions} ${conditionsPassed
					? classes.cloudActionsTop
					: classes.cloudActionsBottom}`}
			>
				{/* <Avatar src={}/> */}
				<Tooltip placement="bottom" title="Download Your RapCloud!">
					<IconButton id="downloadBtn" size="medium" className={classes.headerAction}>
						<a
							className={classes.headerActionLink}
							href={`data:image/png;base64, ${encodedCloud}`}
							download={`${briefedTitle} Rap Cloud.png`}
						>
							<DownloadIcon />
						</a>
					</IconButton>
				</Tooltip>
				<Tooltip placement="bottom" title="Open Your RapCloud in New Tab">
					<IconButton
						id="openInNewTab"
						size="medium"
						className={classes.headerAction}
						onClick={() => base64InNewTab(`data:image/png;base64, ${encodedCloud}`)}
					>
						<NewTabIcon />
					</IconButton>
				</Tooltip>
				<Tooltip placement="bottom" title="Share on Instagram">
					<IconButton id="shareOnIG" size="medium" className={classes.headerAction} onClick={null}>
						I
					</IconButton>
				</Tooltip>
				<Tooltip placement="bottom" title="Share on Facebook">
					<IconButton id="shareOnFB" size="medium" className={classes.headerAction} onClick={null}>
						F
					</IconButton>
				</Tooltip>
				<Tooltip placement="bottom" title="Share on Twitter">
					<IconButton id="shareOnTwitter" size="medium" className={classes.headerAction} onClick={null}>
						T
					</IconButton>
				</Tooltip>
			</Paper>
		);
	};

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
						{renderCloudActions()}
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
						<Typography
							onClick={toggleLyricsExpanded}
							variant="h3"
							classes={{ root: classes.sectionHeader }}
						>
							Lyrics
							<IconButton className={classes.headerAction}>
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

export default connect(mapState, { fetchSongDetails })(withWidth()(SongDetail));
