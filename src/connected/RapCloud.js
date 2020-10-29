import React, { useState, useEffect } from 'react';
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
	FormControlLabel,
	FormGroup,
	Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { updateCloudSettings, fetchMasks, addCustomMask } from '../redux/actions';
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
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { base64InNewTab } from '../utils';
import ImageUploader from 'react-images-upload';

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
		nestedFormSection: {
			marginBottom: '.5em',
			marginTop: '.5em',
		},
		exampleBorder: {
			width: '100%',
			borderRadius: '6px',
			margin: '.5em',
		},
		maskThumbnail: {
			height: '3em',
			margin: '0 1em 0 0',
		},
		choseMaskSection: {
			marginBottom: '1em',
			borderRadius: '6px',
			padding: '.5em',
			backgroundColor: theme.palette.primary.main,
		},
		maskSelections: {
			paddingTop: '.5em',
			paddingBottom: '.5em',
			height: '5em',
			overflowX: 'scroll',
			overflowY: 'hidden',
		},
		choseMaskThumbnailBox: {
			position: 'relative',
			margin: '.5em',
		},
		chosenMaskThumbnail: {
			border: `1px solid ${theme.palette.primary.light}`,
			margin: 0,
		},
		expandChosenMaskIcon: {
			width: '1em',
			height: '1em',
			top: '-.5em',
			right: '-.5em',
			position: 'absolute',
			opacity: '.6',
		},
		blueBorder: {
			border: `3px solid ${theme.palette.secondary.main}`,
		},
		fullScreenMaskContainer: {
			textAlign: 'center',
		},
		fullScreenMask: {
			width: '93%',
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
		fetchMasks,
		addCustomMask,
		masks,
		masksLoading,
		mongoUserId,
	} = props;
	useEffect(() => {
		fetchMasks();
	}, []);

	const [ dialogOpen, toggleDialog ] = useState(false);
	const [ fullScreenMask, toggleFullScreenMask ] = useState(false);
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
								<FormControlLabel
									control={
										<Switch
											checked={cloudSettings.collocations}
											onChange={(e) => {
												updateCloudSettings(e.target.name, e.target.checked);
											}}
											color="secondary"
											name="collocations"
											inputProps={{ 'aria-label': 'toggle include numbers' }}
										/>
									}
									label="Collocations"
								/>
								<FormControlLabel
									control={
										<Switch
											checked={cloudSettings.repeat}
											onChange={(e) => {
												updateCloudSettings(e.target.name, e.target.checked);
											}}
											color="secondary"
											name="repeat"
											inputProps={{ 'aria-label': 'toggle include numbers' }}
										/>
									}
									label="Repeat Words to Fill Picture"
								/>
								<FormControlLabel
									control={
										<Switch
											checked={cloudSettings.includeNumbers}
											onChange={(e) => {
												updateCloudSettings(e.target.name, e.target.checked);
											}}
											color="secondary"
											name="includeNumbers"
											inputProps={{ 'aria-label': 'toggle include numbers' }}
										/>
									}
									label="Include Numbers"
								/>
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
									Mask
								</Typography>
								<Switch
									checked={cloudSettings.maskDesired}
									onChange={(e) => {
										updateCloudSettings(e.target.name, e.target.checked);
									}}
									color="secondary"
									name="maskDesired"
									inputProps={{ 'aria-label': 'toggle mask use' }}
								/>
							</Grid>
							{cloudSettings.maskDesired ? (
								<Grid
									item
									container
									direction="column"
									wrap="wrap"
									justify="flex-start"
									alignContent="center"
									align="center"
								>
									<FormControlLabel
										control={
											<Switch
												checked={cloudSettings.useCustomMask}
												onChange={(e) => {
													updateCloudSettings(e.target.name, e.target.checked);
												}}
												color="secondary"
												name="useCustomMask"
												inputProps={{ 'aria-label': 'toggle detect edges' }}
											/>
										}
										label="Upload Custom Mask"
									/>
									{cloudSettings.useCustomMask ? (
										<Grid item container direction="row">
											<ImageUploader
												withIcon={true}
												buttonText="Choose image"
												onChange={([ pic ]) => {
													console.log('pic', pic);
													const reader = new FileReader();
													let { name, type } = pic;
													name = name.split('.')[0];
													reader.addEventListener(
														'load',
														function() {
															const { result } = reader;
															const dataDeclarationRegEx = new RegExp(
																`data:${pic.type};base64,`,
															);
															const splitResult = result.split(dataDeclarationRegEx);
															const base64Img = splitResult[1];
															const mask = {
																name,
																base64Img,
																userId: mongoUserId,
																type,
															};
															addCustomMask(mask);
														},
														false,
													);
													reader.readAsDataURL(pic);
												}}
												imgExtension={[ '.jpeg', '.jpg', '.png' ]}
												maxFileSize={5242880}
												singleImage
												// withPreview
											/>
										</Grid>
									) : (
										<Grid
											item
											container
											className={classNames(classes.maskSelections)}
											direction="row"
											wrap="nowrap"
											justify="space-between"
											alignContent="center"
											align="center"
										>
											{Object.values(masks).map((mask) => {
												const chosen = mask.id === cloudSettings.maskId;
												return (
													<img
														item
														className={classNames(
															classes.maskThumbnail,
															chosen && classes.blueBorder,
														)}
														elevation={chosen ? 20 : 0}
														src={`data:image/png;base64, ${mask.base64Img}`}
														alt={mask.name}
														onClick={() =>
															updateCloudSettings('maskId', chosen ? null : mask.id)}
													/>
												);
											})}
										</Grid>
									)}
									{cloudSettings.maskId && (
										<Grid
											item
											container
											direction="column"
											justify="center"
											alignItems="center"
											id="chosenMask"
											className={classNames(
												classes.choseMaskSection,
												classes.blueBorder,
												classes.nestedFormSection,
											)}
										>
											<Grid
												item
												container
												direction="row"
												wrap="wrap"
												justify="space-evenly"
												alignItems="center"
											>
												<Tooltip item title="Show Fullscreen View" placement="right">
													<Box
														className={classNames(classes.choseMaskThumbnailBox)}
														onClick={() => toggleFullScreenMask(!fullScreenMask)}
													>
														<IconButton
															className={classNames(classes.expandChosenMaskIcon)}
															color="secondary"
															disableFocusRipple
															disableRipple
														>
															<FullscreenIcon />
														</IconButton>
														<img
															className={classNames(
																classes.maskThumbnail,
																classes.chosenMaskThumbnail,
															)}
															src={`data:image/png;base64, ${masks[cloudSettings.maskId]
																.base64Img}`}
															alt={masks[cloudSettings.maskId].name}
														/>
													</Box>
												</Tooltip>
												<FormGroup item column>
													<TextField
														className={classNames(classes.oneEmMarginRight)}
														onChange={(e) =>
															updateCloudSettings('downSample', e.target.value)}
														label="Down Sample"
														id="downSample"
														value={cloudSettings.downSample}
														type="number"
														autoComplete={false}
													/>
													<FormControlLabel
														control={
															<Switch
																checked={cloudSettings.detectEdges}
																onChange={(e) => {
																	updateCloudSettings(
																		e.target.name,
																		e.target.checked,
																	);
																}}
																color="secondary"
																name="detectEdges"
																inputProps={{ 'aria-label': 'toggle detect edges' }}
															/>
														}
														label="Detect Edges"
													/>
													<FormControlLabel
														control={
															<Switch
																checked={cloudSettings.colorFromMask}
																onChange={(e) => {
																	const { checked } = e.target;
																	updateCloudSettings(e.target.name, checked);
																}}
																color="secondary"
																name="colorFromMask"
																inputProps={{ 'aria-label': 'toggle color from mask' }}
															/>
														}
														label="Use Mask Colors"
													/>
												</FormGroup>
											</Grid>

											<Grid
												item
												container
												className={classNames(classes.formSection, classes.nestedFormSection)}
												direction="column"
											>
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
																onChange={(e) =>
																	updateCloudSettings('contourWidth', e.target.value)}
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
																label={`Contour Color: ${cloudSettings.contourColor}`}
															/>
														</Grid>
													</React.Fragment>
												)}
											</Grid>
										</Grid>
									)}
								</Grid>
							) : null}
							{fullScreenMask && (
								<Dialog open={fullScreenMask} onClose={() => toggleFullScreenMask(false)}>
									<DialogContent className={classes.fullScreenMaskContainer}>
										<img
											item
											className={classNames(classes.fullScreenMask)}
											src={`data:image/png;base64, ${masks[cloudSettings.maskId].base64Img}`}
											alt={masks[cloudSettings.maskId].name}
										/>
									</DialogContent>
									<DialogActions>
										<Button onClick={() => toggleFullScreenMask(false)}>Close</Button>
									</DialogActions>
								</Dialog>
							)}
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
									Background
								</Typography>
								<Switch
									checked={cloudSettings.background}
									onChange={(e) => {
										updateCloudSettings(e.target.name, e.target.checked);
									}}
									color="secondary"
									name="background"
									inputProps={{ 'aria-label': 'primary checkbox' }}
								/>
							</Grid>
							{cloudSettings.background && (
								<React.Fragment>
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
											anchorStyles={{
												backgroundColor: cloudSettings.backgroundColor,
												color: '#f5f5f5',
											}}
											chooseColor={(hex) => {
												updateCloudSettings('backgroundColor', hex);
											}}
											title={'Choose a background color'}
											initialColor="#000000"
											label={`Background Color: ${cloudSettings.backgroundColor}`}
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
							color="primary"
							variant="contained"
							autoFocus
							onClick={() => {
								fetchCloud();
							}}
						>
							Generate Cloud!
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</Grid>
	);
};

const mapState = (state) => ({
	cloudSettings: selectors.getCloudSettings(state),
	masks: selectors.getMasks(state),
	masksLoading: selectors.areMasksLoading(state),
	mongoUserId: selectors.getUserMongoId(state),
});

export default connect(mapState, { updateCloudSettings, fetchMasks, addCustomMask })(withWidth()(RapCloud));
