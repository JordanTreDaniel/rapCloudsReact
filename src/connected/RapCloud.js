import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { IconButton, Grid, withWidth, Tooltip, Paper, Dialog, DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import RapCloudSettings from './RapCloudSettings';
import LoadingBar from '../components/LoadingBar';
import { classNames, imageInNewTab, downloadCloudFromUrl } from '../utils';
import AddIcon from '@material-ui/icons/AddRounded';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import NewTabIcon from '@material-ui/icons/AddToPhotos';
import XIcon from '@material-ui/icons/Cancel';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Delete from '@material-ui/icons/Delete';
// import FacebookIcon from '@material-ui/icons/Facebook';
// import InstagramIcon from '@material-ui/icons/Instagram';
// import TwitterIcon from '@material-ui/icons/Twitter';
import { deleteCloud } from '../redux/actions';

const useStyles = makeStyles((theme) => {
	return {
		wordCloud: {
			margin: 'auto',
			width: '100%',
		},
		wordCloudWrapper: {
			width: '100%',
			margin: 'auto',
			position: 'relative',
			textAlign: 'center',
		},
		cloudActions: {
			backgroundColor: theme.palette.primary.main,
			display: 'flex',
			flexFlow: 'row nowrap',
			alignItems: 'center',
			justifyContent: 'space-around',
			overflowX: 'scroll',
			width: '100%',
		},
		cloudActionsTop: {},
		cloudActionsBottom: {},
		attnGrabber: {
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.main,
			'& a': {
				textDecoration: 'none',
				color: theme.palette.secondary.main,
				backgroundColor: theme.palette.primary.dark,
			},
			'&:hover': {
				backgroundColor: theme.palette.secondary.main,
				color: theme.palette.primary.dark,
				'& a': {
					textDecoration: 'none',
					backgroundColor: theme.palette.secondary.main,
					color: theme.palette.primary.dark,
				},
			},
		},
		addCloudBtn: {
			position: 'absolute',
			width: '2.51em',
			height: '2.51em',
			border: `1px solid ${theme.palette.secondary.main}`,
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
		cycleCloudsBtn: {
			position: 'absolute',
			top: '40%',
			backgroundColor: 'rgb(17, 145, 234, .3)',
			color: theme.palette.secondary.main,
			'&:hover': {
				backgroundColor: 'rgb(17, 145, 234, .8)',
				color: theme.palette.primary.dark,
			},
		},
		cycleCloudsLeft: {
			left: '-1.2em',
		},
		cycleCloudsRight: {
			right: '-1.2em',
		},
	};
});

const RapCloud = (props) => {
	const classes = useStyles();
	const [ settingsOpen, toggleSettings ] = useState(false);
	const [ currentCloudIdx, setCurrentCloudIdx ] = React.useState(0);
	const [ fullScreenCloud, toggleFullScreenCloud ] = useState(false);
	const {
		cloudName,
		clouds,
		width,
		top = '-1em',
		bottom,
		left = '-0.51em',
		right,
		generateCloud,
		isLoading,
		deleteCloud,
	} = props;
	const cloud = clouds[currentCloudIdx];
	const { info, id: cloudId } = cloud || {};
	const { secure_url } = info || {};
	useEffect(
		() => {
			setCurrentCloudIdx(clouds.length - 1);
		},
		[ clouds.length ],
	);
	const cycleClouds = (direction) => {
		let newIdx = direction === 'left' ? currentCloudIdx - 1 : currentCloudIdx + 1;
		if (newIdx >= clouds.length) {
			newIdx = 0;
		} else if (newIdx < 0) {
			newIdx = clouds.length - 1;
		}
		setCurrentCloudIdx(newIdx);
	};
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
				<Tooltip placement="bottom" title="Download Your RapCloud!">
					<IconButton
						id="downloadBtn"
						onClick={() => downloadCloudFromUrl(secure_url, `${cloudName} RapCloud.png`)}
						className={classNames(classes.cloudAction, classes.attnGrabber)}
					>
						<DownloadIcon />
					</IconButton>
				</Tooltip>
				<Tooltip placement="bottom" title="Open Your RapCloud in New Tab">
					<IconButton
						id="openInNewTab"
						size="medium"
						className={classNames(classes.cloudAction, classes.attnGrabber)}
						onClick={() => imageInNewTab(secure_url)}
					>
						<NewTabIcon />
					</IconButton>
				</Tooltip>
				<Tooltip placement="bottom" title="Delete Your RapCloud!">
					<IconButton
						id="deleteBtn"
						onClick={() => {
							deleteCloud(cloudId);
						}}
						className={classNames(classes.cloudAction, classes.attnGrabber)}
					>
						<Delete />
					</IconButton>
				</Tooltip>
			</Paper>
		);
	};
	const renderPagination = (bottomSpace = false) => {
		return (
			<Grid id="paginationContainer" item container xs={12} justify="center">
				<Grid item>
					{clouds.length ? (
						<Pagination
							count={clouds.length}
							page={currentCloudIdx + 1}
							variant="outlined"
							size="small"
							boundaryCount={1}
							color="secondary"
							onChange={(_, val) => setCurrentCloudIdx(val - 1)}
							style={{ marginBottom: bottomSpace ? '.2em' : '0' }}
						/>
					) : null}
				</Grid>
			</Grid>
		);
	};
	return (
		<Grid>
			{cloud && renderCloudActions()}
			{renderPagination(true)}
			<Grid className={classNames(classes.wordCloudWrapper)}>
				<LoadingBar loading={isLoading} />
				<img
					src={secure_url || `${process.env.PUBLIC_URL}/rapClouds.png`}
					alt={'Rap Cloud'}
					className={classes.wordCloud}
					onClick={() => toggleFullScreenCloud(true)}
				/>
				{clouds.length > 1 ? (
					<React.Fragment>
						<IconButton
							onClick={() => cycleClouds('left')}
							className={classNames(classes.cycleCloudsBtn, classes.cycleCloudsLeft)}
						>
							<ChevronLeft />
						</IconButton>
						<IconButton
							onClick={() => cycleClouds('right')}
							className={classNames(classes.cycleCloudsBtn, classes.cycleCloudsRight)}
						>
							<ChevronRight />
						</IconButton>
					</React.Fragment>
				) : null}

				<Tooltip placement="bottom-start" title="Creat a Rap Cloud">
					<IconButton
						onClick={() => toggleSettings(true)}
						className={classNames(classes.addCloudBtn, classes.attnGrabber)}
						style={{ top, bottom, left, right }}
					>
						<AddIcon />
					</IconButton>
				</Tooltip>
			</Grid>
			{settingsOpen && (
				<RapCloudSettings
					dialogOpen={settingsOpen}
					toggleDialog={toggleSettings}
					generateCloud={generateCloud}
				/>
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
									src={secure_url || `${process.env.PUBLIC_URL}/rapClouds.png`}
									alt={cloudName}
									style={{ width: '90%' }}
								/>
							</Grid>
						</Grid>
					</DialogContent>
				</Dialog>
			)}
			{renderPagination()}
		</Grid>
	);
};

export default connect(null, { deleteCloud })(withWidth()(RapCloud));
