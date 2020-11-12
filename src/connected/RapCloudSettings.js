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
import { updateCloudSettings, fetchMasks, addCustomMask, deleteMask, resetCloudDefaults } from '../redux/actions';
import ColorPicker from '../components/ColorPicker';
import LoadingBar from '../components/LoadingBar';
import { connect } from 'react-redux';
import uniq from 'lodash/uniq';
import { classNames } from '../utils';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Refresh from '@material-ui/icons/Refresh';
import AddIcon from '@material-ui/icons/Add';
import XIcon from '@material-ui/icons/Cancel';
import ImageUploader from 'react-images-upload';

const useStyles = makeStyles((theme) => {
	return {
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
			backgroundColor: theme.palette.secondary.main,
		},
		cancelBtn: {
			backgroundColor: theme.palette.primary.light,
			color: theme.palette.primary.contrastText,
			textAlign: 'center',
		},
		resetDefaultsBtn: {},
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
		},
		chosenMaskSection: {
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
			margin: '.5em',
		},
		maskThumbnailBox: {
			position: 'relative',
			marginRight: '1em',
		},
		chosenMaskThumbnail: {
			border: `1px solid ${theme.palette.primary.light}`,
			margin: 0,
		},
		maskAction: {
			width: '1em',
			height: '1em',
			top: '-.5em',
			right: '-.5em',
			position: 'absolute',
			opacity: '.6',
		},
		whiteText: {
			color: theme.palette.primary.contrastText,
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
		maskExplHeader: {
			marginBottom: '1em',
			marginTop: '1em',
			fontWeight: theme.typography.fontWeightBold,
		},
		addMaskBtn: {
			backgroundColor: theme.palette.secondary.main,
			color: theme.palette.secondary.contrastText,
			width: '2em',
			height: '2em',
			marginRight: '.51em',
			'& a': {
				textDecoration: 'none',
				color: theme.palette.secondary.contrastText,
				backgroundColor: theme.palette.secondary.main,
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
	};
});

const RapCloudSettings = (props) => {
	const classes = useStyles();
	const {
		cloudSettings,
		updateCloudSettings,
		fetchMasks,
		addCustomMask,
		deleteMask,
		masks,
		masksLoading,
		mongoUserId,
		dialogOpen,
		toggleDialog,
		fetchCloud,
		resetCloudDefaults,
		currentMask,
	} = props;
	useEffect(() => {
		if (!masks.length) fetchMasks();
	}, []);

	const [ fullScreenMask, toggleFullScreenMask ] = useState(false);
	const [ uploadingCustomMask, toggleUploadDialog ] = useState(false);

	return dialogOpen ? (
		<Dialog
			className={classes.dialog}
			onClose={() => toggleDialog(false)}
			aria-label="cloud-settings-dialog"
			open={dialogOpen}
		>
			<DialogTitle className={classNames(classes.dialogTitle)}>Cloud Customization Settings</DialogTitle>
			<DialogContent>
				<Grid id="colorsSection" container className={classNames(classes.formSection)} direction="column">
					<Grid id="colorsSectionHead">
						<Typography variant="h6" align="left">
							Colors
						</Typography>
					</Grid>
					<Grid
						id="colorsSectionBody"
						item
						container
						direction="row"
						wrap="wrap"
						justify="flex-start"
						alignContent="center"
						align="center"
					>
						<ColorPicker
							chooseColor={(hex) => updateCloudSettings('colors', uniq([ hex, ...cloudSettings.colors ]))}
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
				<Grid id="backgroundSection" container className={classNames(classes.formSection)} direction="column">
					<Grid
						id="backgroundSectionHead"
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
						<Grid id="backgroundSectionBody">
							<FormControlLabel
								control={
									<Switch
										checked={cloudSettings.overlay}
										onChange={(e) => {
											updateCloudSettings(e.target.name, e.target.checked);
										}}
										color="secondary"
										name="overlay"
										inputProps={{ 'aria-label': 'Toggle Use Mask as Background' }}
									/>
								}
								label="Use Mask as Background"
							/>
							{!cloudSettings.overlay && (
								<Grid
									item
									container
									direction="row"
									wrap="wrap"
									justify="flex-start"
									alignContent="center"
									align="center"
									order={1}
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
							)}
						</Grid>
					)}
				</Grid>

				<Grid id="maskSection" container className={classNames(classes.formSection)} direction="column">
					<Grid
						id="maskSectionHead"
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
						<IconButton onClick={fetchMasks} color="secondary">
							<Refresh />
						</IconButton>
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
							id="maskSectionBody"
							item
							container
							direction="column"
							wrap="wrap"
							justify="flex-start"
							alignContent="center"
							align="center"
						>
							<LoadingBar loading={masksLoading} />
							<Grid
								id="maskSelections"
								item
								container
								className={classNames(classes.maskSelections)}
								direction="row"
								wrap="nowrap"
								justify="space-between"
								alignContent="center"
								align="center"
							>
								<Grid
									container
									justify="center"
									alignContent="center"
									className={classNames(classes.maskThumbnail)}
									onClick={() => toggleUploadDialog(true)}
								>
									<Tooltip title="Upload Your Own Mask" placement="top-start">
										<IconButton item className={classes.addMaskBtn}>
											<AddIcon />
										</IconButton>
									</Tooltip>
									{uploadingCustomMask && (
										<Dialog onClose={() => toggleUploadDialog(false)} open={uploadingCustomMask}>
											<DialogContent style={{ textAlign: 'center' }}>
												<Typography
													variant="h5"
													color="primary"
													className={classes.maskExplHeader}
												>
													A mask is a picture that you can use to shape and/or color your
													RapCloud!
												</Typography>
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
																toggleUploadDialog(false);
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
												<Typography
													color="primary"
													variant="h5"
													className={classes.maskExplHeader}
												>
													How does it work?
												</Typography>
												<img
													alt="Example Alice Word Cloud"
													src={`${process.env.PUBLIC_URL}/aliceMaskExample.png`}
													style={{ width: '100%' }}
												/>
												<Typography
													variant="h6"
													color="secondary"
													className={classes.maskExplHeader}
												>
													Taking shape
												</Typography>
												<Typography variant="body1">
													In the example above, the we take the white portion of the image and
													consider it "masked out", which means no words will be drawn on the
													white background of the image, only Alice!
												</Typography>
												<Typography
													variant="body2"
													color="secondary"
													className={classes.maskExplHeader}
												>
													A note on transparency
												</Typography>
												<Typography variant="body1">
													If the image has a transparent (see-through) background, the
													transparent parts of the image will be ignored, instead of the
													white.
												</Typography>
												<Typography
													variant="h6"
													color="secondary"
													className={classes.maskExplHeader}
												>
													Taking color
												</Typography>
												<Typography variant="body1">
													After the RapCloud is generated, it can be re-colored to match the
													mask. Not every mask is a good candidate for this. It generally
													helps to use simple images, and many words.
												</Typography>
											</DialogContent>
											<DialogActions>
												<Button onClick={() => toggleUploadDialog(false)}>Cancel</Button>
											</DialogActions>
										</Dialog>
									)}
								</Grid>
								{masks.map((mask) => {
									const chosen = mask.id === cloudSettings.maskId;
									return (
										<Box className={classNames(classes.maskThumbnailBox)}>
											{mask.userId === mongoUserId && (
												<IconButton
													className={classNames(classes.maskAction, classes.whiteText)}
													disableFocusRipple
													disableRipple
													onClick={() => deleteMask(mask.id)}
												>
													<XIcon />
												</IconButton>
											)}
											<img
												item
												className={classNames(
													classes.maskThumbnail,
													chosen && classes.blueBorder,
												)}
												elevation={chosen ? 20 : 0}
												src={`data:image/png;base64, ${mask.base64Img}`}
												alt={mask.name}
												onClick={() => updateCloudSettings('maskId', chosen ? null : mask.id)}
											/>
										</Box>
									);
								})}
							</Grid>
							{currentMask && (
								<Grid
									id="chosenMaskSettings"
									item
									container
									direction="column"
									justify="center"
									alignItems="center"
									id="chosenMask"
									className={classNames(
										classes.chosenMaskSection,
										classes.blueBorder,
										classes.nestedFormSection,
									)}
								>
									<Grid
										id="chosenMaskQuickSettings"
										item
										container
										direction="row"
										wrap="wrap"
										justify="space-evenly"
										alignItems="center"
									>
										<Tooltip item title="Show Fullscreen View" placement="right">
											<Box
												className={classNames(
													classes.choseMaskThumbnailBox,
													classes.maskThumbnailBox,
												)}
												onClick={() => toggleFullScreenMask(!fullScreenMask)}
											>
												<IconButton
													className={classNames(classes.maskAction)}
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
													src={`data:image/png;base64, ${currentMask.base64Img}`}
													alt={currentMask.name}
												/>
											</Box>
										</Tooltip>
										<FormGroup item column>
											<TextField
												className={classNames(classes.oneEmMarginRight)}
												onChange={(e) => {
													let val = e.target.value;
													if (val > 3) val = 3;
													updateCloudSettings('downSample', val);
												}}
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
															updateCloudSettings(e.target.name, e.target.checked);
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
											<FormControlLabel
												control={
													<Switch
														checked={cloudSettings.overlay}
														onChange={(e) => {
															updateCloudSettings(e.target.name, e.target.checked);
														}}
														color="secondary"
														name="overlay"
														inputProps={{ 'aria-label': 'Toggle Use Mask as Background' }}
													/>
												}
												label="Use Mask as Background"
											/>
										</FormGroup>
									</Grid>

									<Grid
										id="contourSettings"
										item
										container
										className={classNames(classes.formSection, classes.nestedFormSection)}
										direction="column"
									>
										<Grid
											id="contourSettingsHead"
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
											<Grid id="contourSettingsBody">
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
											</Grid>
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
									src={`data:image/png;base64, ${currentMask.base64Img}`}
									alt={currentMask.name}
								/>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => toggleFullScreenMask(false)}>Close</Button>
							</DialogActions>
						</Dialog>
					)}
				</Grid>
				<Grid id="genSettingsSection" container className={classNames(classes.formSection)} direction="column">
					<Grid id="genSettingsSectionHead">
						<Typography variant="h6" align="left">
							General
						</Typography>
					</Grid>
					<Grid item container direction="column">
						<TextField
							item
							className={classNames(classes.oneEmMarginRight)}
							onChange={(e) => {
								let val = e.target.value;
								if (val > 2000) val = 2000;
								updateCloudSettings('width', val);
							}}
							label="Cloud Width"
							id="cloudWidth"
							value={cloudSettings.width}
							type="number"
							autoComplete={false}
						/>
						<TextField
							item
							className={classNames(classes.oneEmMarginRight)}
							onChange={(e) => {
								let val = e.target.value;
								if (val > 2000) val = 2000;
								updateCloudSettings('height', val);
							}}
							label="Cloud Height"
							id="cloudHeight"
							value={cloudSettings.height}
							type="number"
							autoComplete={false}
						/>
						<TextField
							item
							className={classNames(classes.oneEmMarginRight)}
							onChange={(e) => {
								let val = e.target.value;
								if (val > 255) val = 255;
								updateCloudSettings('whiteThreshold', val);
							}}
							label="White Detection Threshold"
							id="whiteThreshold"
							value={cloudSettings.whiteThreshold}
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
			</DialogContent>
			<DialogActions>
				<Button className={classes.cancelBtn} onClick={() => toggleDialog(false)}>
					Cancel
				</Button>
				<Button
					className={classes.resetDefaultsBtn}
					color="primary"
					variant="contained"
					onClick={resetCloudDefaults}
				>
					Reset Defaults
				</Button>
				<Button
					className={classes.fetchCloudBtn}
					color="primary"
					variant="contained"
					autoFocus={true}
					onClick={() => {
						fetchCloud();
						toggleDialog(false);
					}}
					disabled={masksLoading}
				>
					Generate Cloud!
				</Button>
			</DialogActions>
		</Dialog>
	) : null;
};

const mapState = (state) => ({
	cloudSettings: selectors.getCloudSettings(state),
	masks: selectors.getMasks(state),
	currentMask: selectors.getCurrentMask(state),
	masksLoading: selectors.areMasksLoading(state),
	mongoUserId: selectors.getUserMongoId(state),
});

export default connect(mapState, { updateCloudSettings, fetchMasks, addCustomMask, deleteMask, resetCloudDefaults })(
	withWidth()(RapCloudSettings),
);
