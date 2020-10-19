import React, { useState, useEffect } from 'react';
import { Redirect, useParams, Link } from 'react-router-dom';
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
	Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import NewTabIcon from '@material-ui/icons/AddToPhotos';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import { makeStyles } from '@material-ui/core/styles';
import ArtistSongList from './ArtistSongList';
import BackButton from '../components/BackButton';
import LoadingCloud from '../components/LoadingCloud';
import * as selectors from '../redux/selectors';
import { fetchArtist } from '../redux/actions';
import { connect } from 'react-redux';
import paths from '../paths';
import { base64InNewTab } from '../utils';
import LoadingBar from '../components/LoadingBar';

const useStyles = makeStyles((theme) => {
	return {
		artistPage: {
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
			marginBottom: '3em',
		},
		headerBox: {
			display: 'flex',
			flexFlow: 'column wrap',
			alignContent: 'center',
			textAlign: 'center',
			marginTop: '1em',
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
			// paddingBottom: '3em',
			backgroundColor: theme.palette.primary.main,
			border: `1px solid ${theme.palette.primary.light}`,
		},
		songsPaper: {
			padding: '1em',
			margin: '1em',
			position: 'relative',
			backgroundColor: theme.palette.primary.main,
			border: `1px solid ${theme.palette.primary.light}`,
		},
		sectionHeader: {
			textAlign: 'center',
			fontWeight: 600,
			color: theme.palette.secondary.light,
		},
		headerAction: {
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.light,
			margin: '.5em',
			width: '2em',
			height: '2em',
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
		appAction: {
			backgroundColor: theme.palette.secondary.light,
			color: theme.palette.primary.dark,
			margin: '.5em',
			width: '2em',
			height: '2em',
			position: 'absolute',
			top: '-1em',
			left: '-1em',
			zIndex: 2,
			'& a': {
				textDecoration: 'none',
				color: theme.palette.primary.dark,
				backgroundColor: theme.palette.secondary.light,
			},
			'&:hover': {
				backgroundColor: theme.palette.primary.dark,
				color: theme.palette.secondary.light,
				'& a': {
					textDecoration: 'none',
					backgroundColor: theme.palette.primary.dark,
					color: theme.palette.secondary.light,
				},
			},
		},
		headerActionLink: { borderRadius: '50%' },
		cloudActions: {
			backgroundColor: theme.palette.primary.main,
			display: 'flex',
			flexFlow: 'row nowrap',
			// position: 'absolute',
			alignItems: 'center',
			justifyContent: 'space-around',
			overflowX: 'scroll',
			width: '100%',
			padding: '.5em',
			paddingLeft: '3em',
		},
		cloudActionsTop: {},
		cloudActionsBottom: {},
	};
});

const ArtistPage = (props) => {
	const classes = useStyles();
	const { artist, fetchArtist, isArtistLoading, isArtistCloudLoading, width } = props;
	const { artistId } = useParams();
	const [ cloudExpanded, setCloudExpanded ] = React.useState(true);
	const [ songsExpanded, setSongsExpanded ] = React.useState(true);
	const toggleCloudExpanded = () => setCloudExpanded(!cloudExpanded);
	const toggleSongsExpanded = () => setSongsExpanded(!songsExpanded);
	useEffect(
		() => {
			if (artistId) {
				fetchArtist(artistId);
			}
		},
		[ artistId ],
	);

	if (!artistId) return <Redirect to={paths.search} />;
	if (!artist && !isArtistLoading) return null;

	const { name, encodedCloud, path } = artist || {};

	const renderCloudActions = (place) => {
		const conditionsPassed = place === 'bottom' ? width === 'xs' : width !== 'xs';
		return (
			<Paper
				elevation={0}
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
							download={`${name} Rap Cloud.png`}
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
						<InstagramIcon />
					</IconButton>
				</Tooltip>
				<Tooltip placement="bottom" title="Share on Facebook">
					<IconButton id="shareOnFB" size="medium" className={classes.headerAction} onClick={null}>
						<FacebookIcon />
					</IconButton>
				</Tooltip>
				<Tooltip placement="bottom" title="Share on Twitter">
					<IconButton id="shareOnTwitter" size="medium" className={classes.headerAction} onClick={null}>
						<TwitterIcon />
					</IconButton>
				</Tooltip>
			</Paper>
		);
	};

	return (
		<Grid className={classes.artistPage}>
			<AppBar color="inherit" position="static">
				<Toolbar className={classes.toolBar}>
					<div className={classes.leftBubbles}>
						<BackButton />
						<Tooltip placement="bottom" title={`See ${name} on Genius`}>
							<a href={`https://genius.com${path}`} alt={`${name} on Genius`} target="_blank">
								<Avatar src="https://pbs.twimg.com/profile_images/885222003174551552/cv3KtGVS_400x400.jpg" />
							</a>
						</Tooltip>
					</div>
				</Toolbar>
			</AppBar>
			<Grid className={classes.mainContent} container>
				<LoadingBar loading={isArtistLoading} />
				<Grid item xs={12}>
					<div className={classes.headerBox}>
						<Typography variant="h3" className={classes.header}>
							{name}
						</Typography>
					</div>
				</Grid>
				<Grid item sm={12} md={6} classes={{ root: classes.mainContentChild }}>
					<Paper elevation={0} className={classes.wordCloudPaper}>
						<IconButton className={classes.appAction} onClick={toggleCloudExpanded}>
							{cloudExpanded ? <MinusIcon /> : <AddIcon />}
						</IconButton>
						<LoadingBar loading={isArtistCloudLoading} />
						<Typography variant="h3" classes={{ root: classes.sectionHeader }}>
							Cloud
						</Typography>
						{cloudExpanded && (
							<React.Fragment>
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
							</React.Fragment>
						)}
					</Paper>
				</Grid>
				<Grid item sm={12} md={6} classes={{ root: classes.mainContentChild }}>
					<Paper elevation={0} className={classes.songsPaper}>
						<IconButton className={classes.appAction} onClick={toggleSongsExpanded}>
							{songsExpanded ? <MinusIcon /> : <AddIcon />}
						</IconButton>
						<LoadingBar loading={false} /> {/* For spacing */}
						<Typography variant="h3" classes={{ root: classes.sectionHeader }}>
							Songs
						</Typography>
						{songsExpanded && !isArtistLoading && <ArtistSongList artistId={artistId} />}
					</Paper>
				</Grid>
			</Grid>
		</Grid>
	);
};

const mapState = (state) => ({
	artist: selectors.getCurrentArtist(state),
	isArtistLoading: selectors.isArtistLoading(state),
	isArtistCloudLoading: selectors.isArtistCloudLoading(state),
});

export default connect(mapState, { fetchArtist })(withWidth()(ArtistPage));
