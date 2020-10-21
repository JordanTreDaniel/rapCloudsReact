import React, { useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	IconButton,
	DialogContent,
	Grid,
	withWidth,
	Tooltip,
	Paper,
	TextField,
	Typography,
	Chip,
	Switch,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { updateCloudSettings } from '../redux/actions';
import ColorPicker from '../components/ColorPicker';
import { connect } from 'react-redux';
import uniq from 'lodash/uniq';
import { classNames } from '../utils';
import SettingsIcon from '@material-ui/icons/Settings';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import NewTabIcon from '@material-ui/icons/AddToPhotos';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import { base64InNewTab } from '../utils';
const useStyles = makeStyles((theme) => {
	return {
		wordCloud: {
			width: '100%',
			margin: 'auto',
		},
		wordCloudWrapper: {
			width: '100%',
			margin: 'auto',
			marginBottom: '3em',
			position: 'relative',
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
		dialog: {
			textAlign: 'center',
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.contrastText,
			boxShadow: 'none',
		},
		dialogTitle: {
			backgroundColor: theme.palette.primary.dark,
		},
		fetchCloudBtn: {
			backgroundColor: theme.palette.error.main,
			color: theme.palette.error.contrastText,
			textAlign: 'center',
		},
		cancelBtn: {
			backgroundColor: theme.palette.primary.light,
			color: theme.palette.primary.contrastText,
			textAlign: 'center',
		},
		settingsBtn: {
			position: 'absolute',
			backgroundColor: theme.palette.secondary.light,
			color: theme.palette.primary.dark,
		},
		colorChip: {
			marginRight: '.3em',
			marginTop: '.3em',
			border: `1px solid ${theme.palette.primary.dark}`,
		},
		oneEmMarginRight: {
			marginRight: '1em',
		},
		formSection: {
			marginBottom: '1.5em',
			padding: '1em',
			paddingTop: '.3em',
			border: `1px solid ${theme.palette.primary.dark}`,
			borderRadius: '6px',
		},
		exampleBorder: {
			width: '100%',
			borderRadius: '6px',
			margin: '.5em',
		},
	};
});

const RapCloud = (props) => {
	const classes = useStyles();
	const {
		cloudName,
		width,
		encodedCloud,
		fetchCloud,
		cloudSettings,
		top = '-1em',
		bottom,
		left = '-0.75em',
		right,
		updateCloudSettings,
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
				{/* <Avatar src={}/> */}
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
		<Grid>
			{renderCloudActions()}
			<Grid className={classNames(classes.wordCloudWrapper)}>
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
				<Dialog
					className={classes.dialog}
					onClose={() => toggleDialog(false)}
					aria-label="cloud-settings-dialog"
					open={dialogOpen}
				>
					<DialogTitle className={classNames(classes.dialogTitle)}>Cloud Customization Settings</DialogTitle>
					<DialogContent>
						<Grid container className={classNames(classes.formSection)} direction="column">
							<Typography variant="h6" align="left">
								General
							</Typography>
							<Grid item container direction="row">
								<TextField
									item
									className={classNames(classes.oneEmMarginRight)}
									onChange={(e) => updateCloudSettings('width', e.target.value)}
									label="Cloud Width"
									id="cloudWidth"
									value={cloudSettings.width}
									type="number"
									autoComplete={false}
								/>
								<TextField
									item
									className={classNames(classes.oneEmMarginRight)}
									onChange={(e) => updateCloudSettings('height', e.target.value)}
									label="Cloud Height"
									id="cloudHeight"
									value={cloudSettings.height}
									type="number"
									autoComplete={false}
								/>
							</Grid>
						</Grid>
						<Grid container className={classNames(classes.formSection)} direction="column">
							<Typography variant="h6" align="left">
								Colors
							</Typography>
							<Grid
								item
								container
								direction="row"
								wrap="wrap"
								justify="flex-start"
								alignContent="center"
								align="center"
							>
								<ColorPicker
									chooseColor={(hex) =>
										updateCloudSettings('colors', uniq([ hex, ...cloudSettings.colors ]))}
								/>

								{cloudSettings.colors.map((hex, idx) => (
									<Chip
										label={hex}
										className={classNames(classes.colorChip)}
										style={{ backgroundColor: hex }}
										onDelete={() => {
											const newColors = [ ...cloudSettings.colors ];
											newColors.splice(idx, 1);
											updateCloudSettings('colors', newColors);
										}}
									/>
								))}
							</Grid>
						</Grid>
						<Grid container className={classNames(classes.formSection)} direction="column">
							<Grid
								item
								container
								direction="row"
								justify="space-between"
								wrap="nowrap"
								alignItems="center"
							>
								<Typography variant="h6" align="left">
									Contour
								</Typography>
								<Switch
									checked={cloudSettings.contour}
									onChange={(e) => {
										updateCloudSettings(e.target.name, e.target.checked);
										if (parseInt(cloudSettings.contourWidth) == 0) {
											updateCloudSettings('contourWidth', 3);
										}
									}}
									color="secondary"
									name="contour"
									inputProps={{ 'aria-label': 'primary checkbox' }}
								/>
							</Grid>
							{cloudSettings.contour && (
								<React.Fragment>
									<div
										className={classNames(classes.exampleBorder)}
										style={{
											height: `${cloudSettings.contourWidth}px`,
											backgroundColor: cloudSettings.contourColor,
										}}
									/>
									<Grid
										item
										container
										direction="row"
										wrap="wrap"
										justify="flex-start"
										alignContent="center"
										align="center"
									>
										<TextField
											item
											className={classNames(classes.oneEmMarginRight)}
											onChange={(e) => updateCloudSettings('contourWidth', e.target.value)}
											label="Contour Thickness"
											id="contourWidth"
											value={cloudSettings.contourWidth}
											type="number"
											autoComplete={false}
										/>
										<ColorPicker
											anchorStyles={{
												backgroundColor: cloudSettings.contourColor,
												color: '#f5f5f5',
											}}
											chooseColor={(hex) => {
												updateCloudSettings('contourColor', hex);
											}}
											title={'Choose a contour color'}
											initialColor="#000000"
											label="Contour Color"
										/>
									</Grid>
								</React.Fragment>
							)}
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button className={classes.cancelBtn} onClick={() => toggleDialog(false)}>
							Cancel
						</Button>
						<Button
							className={classes.fetchCloudBtn}
							autoFocus
							onClick={() => {
								fetchCloud(cloudSettings);
							}}
						>
							Log Out
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</Grid>
	);
};

const mapState = (state) => ({
	cloudSettings: selectors.getCloudSettings(state),
});

export default connect(mapState, { updateCloudSettings })(withWidth()(RapCloud));
