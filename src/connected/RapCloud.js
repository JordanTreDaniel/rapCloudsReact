import React, { useState } from 'react';
import { IconButton, Grid, withWidth, Tooltip, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RapCloudSettings from './RapCloudSettings';
import LoadingBar from '../components/LoadingBar';
import { classNames } from '../utils';
import SettingsIcon from '@material-ui/icons/Settings';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import NewTabIcon from '@material-ui/icons/AddToPhotos';
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
		settingsBtn: {
			position: 'absolute',
			backgroundColor: theme.palette.secondary.light,
			color: theme.palette.primary.dark,
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
		headerActionLink: { borderRadius: '50%' },
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
		left = '-0.75em',
		right,
		fetchCloud,
		isLoading,
	} = props;

	const [ dialogOpen, toggleDialog ] = useState(false);
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
					<IconButton id="downloadBtn" size="medium" className={classes.headerAction}>
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
						className={classes.headerAction}
						onClick={() => base64InNewTab(`data:image/png;base64, ${encodedCloud}`)}
					>
						<NewTabIcon />
					</IconButton>
				</Tooltip>
				{/* <Tooltip placement="bottom" title="Share on Instagram">
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
				/>
				<Tooltip placement="bottom-start" title="Customize this Rap Cloud!">
					<IconButton
						onClick={() => toggleDialog(true)}
						className={classNames(classes.settingsBtn)}
						style={{ top, bottom, left, right }}
					>
						<SettingsIcon />
					</IconButton>
				</Tooltip>
			</Grid>
			{dialogOpen && (
				<RapCloudSettings dialogOpen={dialogOpen} toggleDialog={toggleDialog} fetchCloud={fetchCloud} />
			)}
		</Grid>
	);
};

export default withWidth()(RapCloud);
