import React, { useState } from 'react';
import {
	IconButton,
	Grid,
	withWidth,
	Tooltip,
	Paper,
	Dialog,
	DialogContent,
	DialogActions,
	Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RapCloudSettings from './RapCloudSettings';
import LoadingBar from '../components/LoadingBar';
import { classNames } from '../utils';
import SettingsIcon from '@material-ui/icons/Settings';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import NewTabIcon from '@material-ui/icons/AddToPhotos';
import XIcon from '@material-ui/icons/Cancel';
// import FacebookIcon from '@material-ui/icons/Facebook';
// import InstagramIcon from '@material-ui/icons/Instagram';
// import TwitterIcon from '@material-ui/icons/Twitter';
import { base64InNewTab } from '../utils';

const useStyles = makeStyles((theme) => {
	return {
		wordCloud: {
			margin: 'auto',
			width: '100%',
		},
		wordCloudWrapper: {
			width: '100%',
			margin: 'auto',
			marginBottom: '3em',
			position: 'relative',
			textAlign: 'center',
		},
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
		attnGrabber: {
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.light,
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
		settingsBtn: {
			position: 'absolute',
			width: '2.51em',
			height: '2.51em',
			border: `1px solid ${theme.palette.secondary.light}`,
			'& *': {
				fontSize: '1.5em',
			},
		},
		cloudAction: {
			margin: '.5em',
			width: '2em',
			height: '2em',
		},
		headerActionLink: { borderRadius: '50%' },
		darkBacking: {
			backgroundColor: theme.palette.primary.dark,
		},
		closeFullCloud: {
			position: 'absolute',
			top: '-0.5em',
			right: '-0.5em',
			width: '3em',
			height: '3em',
			color: theme.palette.secondary.main,
		},
	};
});

const RapCloud = (props) => {
	const classes = useStyles();
	const {
		cloudName,
		width,
		encodedCloud,
		top = '-1em',
		bottom,
		left = '-0.51em',
		right,
		fetchCloud,
		isLoading,
	} = props;

	const [ settingsOpen, toggleSettings ] = useState(false);
	const [ fullScreenCloud, toggleFullScreenCloud ] = useState(false);
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
				<Tooltip placement="bottom" title="Download Your RapCloud!">
					<IconButton id="downloadBtn" className={classNames(classes.cloudAction, classes.attnGrabber)}>
						<a
							className={classes.headerActionLink}
							href={`data:image/png;base64, ${encodedCloud}`}
							download={`${cloudName} Rap Cloud.png`}
						>
							<DownloadIcon />
						</a>
					</IconButton>
				</Tooltip>
				<Tooltip placement="bottom" title="Open Your RapCloud in New Tab">
					<IconButton
						id="openInNewTab"
						size="medium"
						className={classNames(classes.cloudAction, classes.attnGrabber)}
						onClick={() => base64InNewTab(`data:image/png;base64, ${encodedCloud}`)}
					>
						<NewTabIcon />
					</IconButton>
				</Tooltip>
				{/* <Tooltip placement="bottom" title="Share on Instagram">
					<IconButton id="shareOnIG" size="medium" className={classNames(classes.cloudAction, classes.attnGrabber)} onClick={null}>
						<InstagramIcon />
					</IconButton>
				</Tooltip>
				<Tooltip placement="bottom" title="Share on Facebook">
					<IconButton id="shareOnFB" size="medium" className={classNames(classes.cloudAction, classes.attnGrabber)} onClick={null}>
						<FacebookIcon />
					</IconButton>
				</Tooltip>
				<Tooltip placement="bottom" title="Share on Twitter">
					<IconButton id="shareOnTwitter" size="medium" className={classNames(classes.cloudAction, classes.attnGrabber)} onClick={null}>
						<TwitterIcon />
					</IconButton>
				</Tooltip> */}
			</Paper>
		);
	};

	return (
		<Grid>
			{renderCloudActions()}
			<Grid className={classNames(classes.wordCloudWrapper)}>
				<LoadingBar loading={isLoading} />
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
					onClick={() => toggleFullScreenCloud(true)}
				/>
				<Tooltip placement="bottom-start" title="Customize this Rap Cloud!">
					<IconButton
						onClick={() => toggleSettings(true)}
						className={classNames(classes.settingsBtn, classes.attnGrabber)}
						style={{ top, bottom, left, right }}
					>
						<SettingsIcon />
					</IconButton>
				</Tooltip>
			</Grid>
			{settingsOpen && (
				<RapCloudSettings dialogOpen={settingsOpen} toggleDialog={toggleSettings} fetchCloud={fetchCloud} />
			)}
			{fullScreenCloud && (
				<Dialog fullScreen open={true}>
					<DialogContent classes={{ root: classes.darkBacking }}>
						<Grid
							container
							direction="row"
							justify="center"
							alignItems="center"
							wrap="nowrap"
							style={{ height: '100%', position: 'relative' }}
						>
							<XIcon className={classes.closeFullCloud} onClick={() => toggleFullScreenCloud(false)} />
							<Grid item xs={12} style={{ textAlign: 'center' }}>
								<img
									item
									src={
										encodedCloud ? (
											`data:image/png;base64, ${encodedCloud}`
										) : (
											`${process.env.PUBLIC_URL}/rapClouds.png`
										)
									}
									alt={'Rap Cloud'}
									style={{ width: '90%' }}
								/>
							</Grid>
						</Grid>
					</DialogContent>
				</Dialog>
			)}
		</Grid>
	);
};

export default withWidth()(RapCloud);
