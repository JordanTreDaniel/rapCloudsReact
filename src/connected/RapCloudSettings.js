import React, { useState, useEffect, Fragment } from "react";
import {
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	FormGroup,
	Grid,
	IconButton,
	Input,
	Switch,
	TextField,
	Tooltip,
	Typography,
	Slider,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import * as selectors from "../redux/selectors";
import {
	updateCloudSettings,
	fetchMasks,
	deleteMask,
	resetCloudDefaults,
	fetchGoogleFonts,
	setFontSearchTerm,
	setCurrentFontName,
} from "../redux/actions";
import ColorPicker from "../components/ColorPicker";
import LoadingBar from "../components/LoadingBar";
import HelpTooltip from "../components/HelpTooltip";
import { connect } from "react-redux";
import uniq from "lodash/uniq";
import { classNames } from "../utils";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import SearchIcon from "@mui/icons-material/Search";
import Refresh from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import XIcon from "@mui/icons-material/Cancel";
import DebouncedInput from "../components/DebouncedInput";
const DebouncedTextField = DebouncedInput(Input, { timeout: 639 });
const useStyles = makeStyles((theme) => {
	return {
		dialog: {
			textAlign: "center",
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.contrastText,
			boxShadow: "none",
		},
		dialogTitle: {
			backgroundColor: theme.palette.primary.dark,
		},
		fetchCloudBtn: {
			textAlign: "center",
			backgroundColor: theme.palette.secondary.main,
		},
		cancelBtn: {
			backgroundColor: theme.palette.primary.light,
			color: theme.palette.primary.contrastText,
			textAlign: "center",
		},
		resetDefaultsBtn: {},
		colorChip: {
			marginRight: ".3em",
			marginTop: ".3em",
			border: `1px solid ${theme.palette.primary.dark}`,
		},
		oneEmMarginRight: {
			marginRight: "1em",
		},
		formSection: {
			marginBottom: "1.5em",
			padding: "1em",
			paddingTop: ".3em",
			border: `1px solid ${theme.palette.primary.dark}`,
			borderRadius: "6px",
		},
		nestedFormSection: {
			marginBottom: ".5em",
			marginTop: ".5em",
		},
		exampleBorder: {
			width: "100%",
			borderRadius: "6px",
			margin: ".5em",
		},
		maskThumbnail: {
			height: "3em",
		},
		chosenMaskSection: {
			marginBottom: "1em",
			borderRadius: "6px",
			padding: ".5em",
			backgroundColor: theme.palette.primary.main,
		},
		maskSelections: {
			paddingTop: ".5em",
			paddingBottom: ".5em",
			height: "5em",
			overflowX: "scroll",
			overflowY: "hidden",
		},
		choseMaskThumbnailBox: {
			margin: ".5em",
		},
		maskThumbnailBox: {
			position: "relative",
			marginRight: "1em",
		},
		chosenMaskThumbnail: {
			border: `1px solid ${theme.palette.primary.light}`,
			margin: 0,
		},
		maskAction: {
			width: "1em",
			height: "1em",
			top: "-.5em",
			right: "-.5em",
			position: "absolute",
			opacity: ".6",
		},
		whiteText: {
			color: theme.palette.primary.contrastText,
		},
		blueBorder: {
			border: `3px solid ${theme.palette.secondary.main}`,
		},
		fullScreenMaskContainer: {
			textAlign: "center",
		},
		fullScreenMask: {
			width: "93%",
		},
		maskExplHeader: {
			marginBottom: "1em",
			marginTop: "1em",
			fontWeight: theme.typography.fontWeightBold,
		},
		addMaskBtn: {
			backgroundColor: theme.palette.secondary.main,
			color: theme.palette.secondary.contrastText,
			width: "2em",
			height: "2em",
			marginRight: ".51em",
			"& a": {
				textDecoration: "none",
				color: theme.palette.secondary.contrastText,
				backgroundColor: theme.palette.secondary.main,
			},
			"&:hover": {
				backgroundColor: theme.palette.secondary.light,
				color: theme.palette.primary.dark,
				"& a": {
					textDecoration: "none",
					backgroundColor: theme.palette.secondary.light,
					color: theme.palette.primary.dark,
				},
			},
		},
		chosenFontChip: {
			backgroundColor: theme.palette.primary.light,
			color: theme.palette.primary.contrastText,
		},
		sliderUIGroup: {
			border: `1.11px solid ${theme.palette.primary.light}`,
			padding: "1.2em",
			borderRadius: "6px",
		},
	};
});

const RapCloudSettings = (props) => {
	const classes = useStyles();
	const {
		cloudSettings,
		updateCloudSettings,
		fetchMasks,
		deleteMask,
		masks,
		masksLoading,
		mongoUserId,
		dialogOpen,
		toggleDialog,
		generateCloud,
		resetCloudDefaults,
		currentMask,
		fonts,
		fetchGoogleFonts,
		setFontSearchTerm,
		fontSearchTerm,
		currentFontName,
		setCurrentFontName,
	} = props;
	useEffect(() => {
		if (!fonts.length) fetchGoogleFonts();
	}, []);
	useEffect(() => {
		if (!masks.length) fetchMasks();
	}, [masks, fetchMasks]);

	const [fullScreenMask, toggleFullScreenMask] = useState(false);
	const [uploadingCustomMask, toggleUploadDialog] = useState(false);

	return dialogOpen ? (
		<Dialog
			className={classes.dialog}
			onClose={() => toggleDialog(false)}
			aria-label="cloud-settings-dialog"
			open={dialogOpen}
		>
			<DialogTitle className={classNames(classes.dialogTitle)}>
				Cloud Customization Settings
			</DialogTitle>
			<DialogContent>
				<Grid
					id="fontsSection"
					container
					className={classNames(classes.formSection)}
					direction="column"
				>
					<Grid
						id="fontsSectionHead"
						item
						container
						direction="row"
						justifyContent="space-between"
						wrap="nowrap"
						alignItems="center"
					>
						<Switch
							checked={cloudSettings.fontDesired}
							onChange={(e) => {
								const { checked } = e.target;
								updateCloudSettings(e.target.name, checked);
							}}
							color="secondary"
							name="fontDesired"
							inputProps={{
								"aria-label": "Toggle use of custom font in RapCloud",
							}}
						/>
						<HelpTooltip
							titles={[
								"This option determines what font the words in your RapCloud will appear in.",
								`The font is everything when it comes to making your RapCloud look the best.`,
							]}
						>
							<Typography variant="h6">Fonts</Typography>
						</HelpTooltip>
					</Grid>
					<Grid
						id="fontsSectionBody"
						item
						container
						direction="column"
						wrap="nowrap"
					>
						{cloudSettings.fontDesired && (
							<Fragment>
								<DebouncedTextField
									type="text"
									onChange={(e) => {
										const { value: newSearchTerm } = e.target;
										setFontSearchTerm(newSearchTerm);
									}}
									value={fontSearchTerm}
									disableUnderline
									fullWidth
									placeholder="Search..."
									inputProps={{ className: classes.mainSearchInput }}
									multiline={false}
									autoFocus
									endAdornment={
										<IconButton
											className={classes.searchIcon}
											aria-label="search-icon"
											component="span"
										>
											<SearchIcon />
										</IconButton>
									}
								/>

								{/* list of fonts filtered by input */}
								<Grid container id="fontListContainer">
									{fonts.map((font, idx) => {
										const isChosen = font === currentFontName;
										return (
											<Grid
												item
												component={Chip}
												key={idx}
												label={font}
												color={isChosen ? "primary" : "secondary"}
												disabled={isChosen}
												clickable={!isChosen}
												onClick={() => setCurrentFontName(font)}
												// className={isChosen ? classes.chosenFontChip : null}
												variant={"filled"}
											/>
										);
									})}
								</Grid>
								<small style={{ marginTop: "1.2em" }}>
									Go to{" "}
									<a
										href="https://fonts.google.com"
										aria-label="Google Fonts Link"
										target="_blank"
										rel="noopener noreferrer"
									>
										fonts.google.com
									</a>{" "}
									in order to see all available fonts.
								</small>
							</Fragment>
						)}
					</Grid>
				</Grid>
				<Grid
					id="colorsSection"
					container
					className={classNames(classes.formSection)}
					direction="column"
				>
					<Grid
						id="colorsSectionHead"
						item
						container
						direction="row"
						justifyContent="space-between"
						wrap="nowrap"
						alignItems="center"
					>
						<HelpTooltip
							titles={[
								"This option determines what colors the words in your RapCloud will be.",
							]}
						>
							<Typography variant="h6">Colors</Typography>
						</HelpTooltip>
					</Grid>
					<Grid
						id="colorsSectionBody"
						item
						container
						direction="column"
						wrap="nowrap"
					>
						<FormControlLabel
							item="true"
							control={
								<Switch
									checked={cloudSettings.useRandomColors}
									onChange={(e) => {
										updateCloudSettings(e.target.name, e.target.checked);
									}}
									color="secondary"
									name="useRandomColors"
									inputProps={{ "aria-label": "Toggle Random Colors" }}
								/>
							}
							label={
								<HelpTooltip
									titles={["Randomly chosen colors from the `Viridis` set"]}
								>
									Random Colors
								</HelpTooltip>
							}
						/>
						<FormControlLabel
							item="true"
							control={
								<Switch
									checked={cloudSettings.colorFromMask}
									onChange={(e) => {
										const { checked } = e.target;
										updateCloudSettings(e.target.name, checked);
									}}
									disabled={!cloudSettings.maskDesired || !cloudSettings.maskId}
									color="secondary"
									name="colorFromMask"
									inputProps={{ "aria-label": "Toggle Color from Mask" }}
								/>
							}
							label={
								<HelpTooltip
									titles={[
										`Choose this option in order to have the Rap Cloud resemble your mask
												image in color, not just shape.`,
										`Each word will take the average color of whatever space it occupies on
												your mask image.`,
									]}
								>
									Color from Mask
								</HelpTooltip>
							}
						/>
						<Grid
							id="customColorsLabelBox"
							item
							container
							direction="row"
							justifyContent="space-between"
						>
							<FormControlLabel
								item="true"
								control={
									<Switch
										checked={cloudSettings.useCustomColors}
										onChange={(e) => {
											const { checked } = e.target;
											updateCloudSettings(e.target.name, checked);
										}}
										color="secondary"
										name="useCustomColors"
										inputProps={{ "aria-label": "Toggle Use Custom Colors" }}
									/>
								}
								label={
									<HelpTooltip
										titles={[
											`Choose this option in order to have the Rap Cloud resemble your mask
													image in color, not just shape.`,
											`Each word will take the average color of whatever space it occupies
													on your mask image.`,
										]}
									>
										Choose Custom Colors
									</HelpTooltip>
								}
							/>
							{cloudSettings.useCustomColors && !!cloudSettings.colors.length && (
								<IconButton
									item="true"
									onClick={() => updateCloudSettings("colors", [])}
									color="secondary"
								>
									<XIcon />
								</IconButton>
							)}
						</Grid>
						{cloudSettings.useCustomColors && (
							<Grid
								item
								container
								direction="row"
								wrap="wrap"
								alignContent="center"
								alignItems="center"
								justifyContent="flex-start"
							>
								<ColorPicker
									chooseColor={(hex) =>
										updateCloudSettings(
											"colors",
											uniq([hex, ...cloudSettings.colors])
										)
									}
									disabled={
										cloudSettings.colorFromMask ||
										!cloudSettings.useCustomColors
									}
								/>
								{cloudSettings.colors.map((hex, idx) => (
									<Chip
										label={hex}
										key={idx}
										className={classNames(classes.colorChip)}
										style={{ backgroundColor: hex }}
										onDelete={() => {
											const newColors = [...cloudSettings.colors];
											newColors.splice(idx, 1);
											updateCloudSettings("colors", newColors);
										}}
										disabled={
											cloudSettings.colorFromMask ||
											!cloudSettings.useCustomColors
										}
									/>
								))}
							</Grid>
						)}
					</Grid>
				</Grid>
				<Grid
					id="backgroundSection"
					container
					className={classNames(classes.formSection)}
					direction="column"
				>
					<Grid
						id="backgroundSectionHead"
						item
						container
						direction="row"
						justifyContent="space-between"
						wrap="nowrap"
						alignItems="center"
					>
						<HelpTooltip
							titles={[
								`This option determines if you will have a background, and how the background will look`,
							]}
						>
							<Typography variant="h6" alignItems="left">
								Background
							</Typography>
						</HelpTooltip>
					</Grid>
					<Grid
						id="backgroundSectionBody"
						item
						container
						direction="column"
						justifyContent="space-evenly"
					>
						<Grid
							item
							container
							direction="row"
							wrap="nowrap"
							justifyContent="flex-start"
							alignContent="center"
							alignItems="center"
						>
							<FormControlLabel
								item="true"
								control={
									<Switch
										checked={cloudSettings.coloredBackground}
										onChange={(e) => {
											updateCloudSettings(e.target.name, e.target.checked);
										}}
										color="secondary"
										name="coloredBackground"
										inputProps={{ "aria-label": "Toggle Colored Background" }}
									/>
								}
								label={
									<HelpTooltip
										titles={[
											`Background will be a solid color of your choice.`,
											`This choice defaults to black`,
										]}
									>
										Colored
									</HelpTooltip>
								}
							/>
							<ColorPicker
								item="true"
								disabled={!cloudSettings.coloredBackground}
								anchorStyles={{
									backgroundColor: cloudSettings.backgroundColor,
									color: "#f5f5f5",
								}}
								chooseColor={(hex) => {
									updateCloudSettings("backgroundColor", hex);
								}}
								title={"Choose a background color"}
								initialColor="#000000"
								label={cloudSettings.backgroundColor}
							/>
						</Grid>

						<Grid
							item
							container
							direction="row"
							wrap="wrap"
							justifyContent="flex-start"
							alignContent="center"
							alignItems="center"
						>
							<FormControlLabel
								item="true"
								control={
									<Switch
										checked={cloudSettings.transparentBackground}
										onChange={(e) => {
											updateCloudSettings(e.target.name, e.target.checked);
										}}
										color="secondary"
										name="transparentBackground"
										inputProps={{
											"aria-label": "Toggle Transparent Background",
										}}
									/>
								}
								label={
									<HelpTooltip
										titles={[
											`The background will not be there! Completely see-through`,
										]}
									>
										Transparent
									</HelpTooltip>
								}
							/>
						</Grid>
						<Grid
							item
							container
							direction="row"
							wrap="wrap"
							justifyContent="flex-start"
							alignContent="center"
							alignItems="center"
						>
							<FormControlLabel
								item="true"
								control={
									<Switch
										checked={cloudSettings.maskAsBackground}
										onChange={(e) => {
											updateCloudSettings(e.target.name, e.target.checked);
										}}
										disabled={
											!cloudSettings.maskDesired || !cloudSettings.maskId
										}
										color="secondary"
										name="maskAsBackground"
										inputProps={{
											"aria-label": "Toggle Use Mask as Background",
										}}
									/>
								}
								label={
									<HelpTooltip
										titles={[
											`The background will be the original mask image chosen`,
										]}
									>
										Mask as Background
									</HelpTooltip>
								}
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid
					id="maskSection"
					container
					className={classNames(classes.formSection)}
					direction="column"
				>
					<Grid
						id="maskSectionHead"
						item
						container
						direction="row"
						justifyContent="space-between"
						wrap="nowrap"
						alignItems="center"
					>
						<FormControlLabel
							item="true"
							control={
								<Switch
									checked={cloudSettings.maskDesired}
									onChange={(e) => {
										updateCloudSettings(e.target.name, e.target.checked);
									}}
									color="secondary"
									name="maskDesired"
									inputProps={{ "aria-label": "Toggle Use of Mask" }}
								/>
							}
							label={
								<HelpTooltip
									titles={[
										`A mask is a picture that you can use to shape and/or color your RapCloud!`,
										`Click the blue, "Add Mask" (+) button to learn more about masks.`,
									]}
									onClick={() => toggleUploadDialog(true)}
								>
									Mask
								</HelpTooltip>
							}
						/>
						<IconButton onClick={fetchMasks} color="secondary">
							<Refresh />
						</IconButton>
					</Grid>
					{cloudSettings.maskDesired ? (
						<Grid
							id="maskSectionBody"
							item
							container
							direction="column"
							wrap="wrap"
							justifyContent="flex-start"
							alignContent="center"
							alignItems="center"
						>
							<LoadingBar loading={masksLoading} />

							<Grid
								id="maskSelections"
								item
								container
								className={classNames(classes.maskSelections)}
								direction="row"
								wrap="nowrap"
								justifyContent="space-between"
								alignContent="center"
								alignItems="center"
							>
								<Grid
									container
									justifyContent="center"
									alignContent="center"
									className={classNames(classes.maskThumbnail)}
									onClick={window.openWidget}
								>
									<Tooltip title="Upload Your Own Mask" placement="top-start">
										<IconButton item="true" className={classes.addMaskBtn}>
											<AddIcon />
										</IconButton>
									</Tooltip>
									{uploadingCustomMask && (
										<Dialog
											onClose={() => toggleUploadDialog(false)}
											open={uploadingCustomMask}
										>
											<DialogContent style={{ textAlign: "center" }}>
												<Typography
													variant="h5"
													color="primary"
													className={classes.maskExplHeader}
												>
													A mask is a picture that you can use to shape and/or
													color your RapCloud!
												</Typography>
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
													style={{ width: "100%" }}
												/>
												<Typography
													variant="h6"
													color="secondary"
													className={classes.maskExplHeader}
												>
													Taking shape
												</Typography>
												<Typography variant="body1">
													In the example above, the we take the white portion of
													the image and consider it "masked out", which means no
													words will be drawn on the white background of the
													image, only Alice!
												</Typography>
												<Typography
													variant="body2"
													color="secondary"
													className={classes.maskExplHeader}
												>
													A note on transparency
												</Typography>
												<Typography variant="body1">
													If the image has a transparent (see-through)
													background, the transparent parts of the image will be
													ignored, instead of the white.
												</Typography>
												<Typography
													variant="h6"
													color="secondary"
													className={classes.maskExplHeader}
												>
													Taking color
												</Typography>
												<Typography variant="body1">
													After the RapCloud is generated, it can be re-colored
													to match the mask. Not every mask is a good candidate
													for this. It generally helps to use simple images, and
													many words.
												</Typography>
											</DialogContent>
											<DialogActions>
												<Button onClick={() => toggleUploadDialog(false)}>
													Cancel
												</Button>
											</DialogActions>
										</Dialog>
									)}
								</Grid>
								{masks.map((mask, idx) => {
									const chosen = mask.id === cloudSettings.maskId;
									return (
										<Box
											className={classNames(classes.maskThumbnailBox)}
											key={idx}
										>
											{mask.userId === mongoUserId && (
												<IconButton
													className={classNames(
														classes.maskAction,
														classes.whiteText
													)}
													disableFocusRipple
													disableRipple
													onClick={() => deleteMask(mask.id)}
												>
													<XIcon />
												</IconButton>
											)}
											<img
												item="true"
												className={classNames(
													classes.maskThumbnail,
													chosen && classes.blueBorder
												)}
												elevation={chosen ? 20 : 0}
												src={
													(mask && mask.info && mask.info.secure_url) ||
													`${process.env.PUBLIC_URL}/rapClouds.png`
												}
												alt={`${
													mask && mask.info && mask.info.original_filename
												} Mask`}
												onClick={() =>
													updateCloudSettings("maskId", chosen ? null : mask.id)
												}
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
									justifyContent="center"
									alignItems="center"
									className={classNames(
										classes.chosenMaskSection,
										classes.blueBorder,
										classes.nestedFormSection
									)}
								>
									<Grid
										id="chosenMaskQuickSettings"
										item
										container
										direction="column"
										wrap="wrap"
										justifyContent="space-evenly"
										alignItems="center"
									>
										<Tooltip title="Show Fullscreen View" placement="right">
											<Box
												item="true"
												className={classNames(
													classes.choseMaskThumbnailBox,
													classes.maskThumbnailBox
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
														classes.chosenMaskThumbnail
													)}
													src={currentMask.info.secure_url}
													alt={`${currentMask.info.original_filename} Mask`}
												/>
											</Box>
										</Tooltip>
										<Grid
											id="whiteThresholdUIContainer"
											item
											container
											direction="column"
											xs={8} //TO-DO: Make this grid fit a little more tightly into the	space provided
											className={classes.sliderUIGroup}
										>
											<Grid item container justifyContent="space-between">
												<Grid
													item
													xs={9}
													component={HelpTooltip}
													titles={[
														`Words won't be drawn onto any parts of an image brighter than the indicator to the right.`,
														`If you could set it to 0, it would consider everything too bright to draw on. But minimum is 1`,
													]}
												>
													<Typography variant="overline">
														Brightness Sensitivity
													</Typography>
												</Grid>
												<Grid
													item
													container
													xs={3}
													justifyContent="center"
													alignItems={"center"}
												>
													<Grid
														component={Chip}
														item
														label={cloudSettings.whiteThreshold}
														style={{
															width: "55.5%",
															backgroundColor: `rgb(${cloudSettings.whiteThreshold}, ${cloudSettings.whiteThreshold}, ${cloudSettings.whiteThreshold})`,
														}}
													></Grid>
												</Grid>
											</Grid>
											<Slider
												id="whiteThreshold"
												aria-label="Brightness Sensitivity Slider"
												max={255}
												min={1}
												step={1}
												size="small"
												value={parseInt(cloudSettings.whiteThreshold)}
												valueLabelDisplay="auto"
												marks={[
													{ value: 1, label: 1 },
													{ value: 125, label: 125 },
													{ value: 255, label: 255 },
												]}
												onChange={(e) => {
													updateCloudSettings(e.target.name, e.target.value);
												}}
												color="secondary"
												name="whiteThreshold"
											/>
										</Grid>
										<Grid
											id="downsampleSettingsContainer"
											item
											container
											direction="column"
											xs={8}
											className={classes.sliderUIGroup}
											style={{ marginTop: "1.2em" }}
										>
											<Grid item container justifyContent="space-between">
												<Grid
													item
													xs={9}
													component={HelpTooltip}
													titles={[
														`Downsampling is the process of making your mask image smaller by removing some of the definition/detail.`,
														`Higher downsampling (like 3) will result in a less detailed image, but your Rap Cloud will be generated much more quickly`,
														`Lower downsampling, (like 0 or 1) will result in a highly detailed Rap Cloud, but will take much longer.`,
													]}
												>
													<Typography variant="overline">
														Down Sample
													</Typography>
												</Grid>
											</Grid>
											<Slider
												id="downsampleSlider"
												aria-label="Downsample Slider"
												max={3}
												min={1}
												step={1}
												size="small"
												value={parseInt(cloudSettings.downSample)}
												valueLabelDisplay="auto"
												marks={[
													{ value: 1, label: 1 },
													{ value: 2, label: 2 },
													{ value: 3, label: 3 },
												]}
												onChange={(e) => {
													updateCloudSettings(e.target.name, e.target.value);
												}}
												color="secondary"
												name="downSample"
											/>
										</Grid>

										<FormGroup item="true">
											<FormControlLabel
												control={
													<Switch
														checked={cloudSettings.detectEdges}
														onChange={(e) => {
															updateCloudSettings(
																e.target.name,
																e.target.checked
															);
														}}
														color="secondary"
														name="detectEdges"
														inputProps={{ "aria-label": "toggle detect edges" }}
													/>
												}
												label={
													<HelpTooltip
														titles={[
															`Attempts to detect edges of objects within your mask image, then instructs the Rap Cloud not to put words on top of those edges.`,
															`This results in the words within the cloud "drawing" the edges, making them more visible.`,
														]}
													>
														Detect Edges
													</HelpTooltip>
												}
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
														inputProps={{
															"aria-label": "toggle color from mask",
														}}
													/>
												}
												label={
													<HelpTooltip
														titles={[
															`Choose this option in order to have the Rap Cloud resemble your mask image in color, not just shape.`,
															`Each word will take the average color of whatever space it occupies on your mask image.`,
														]}
													>
														Use Mask Colors
													</HelpTooltip>
												}
											/>
											<FormControlLabel
												control={
													<Switch
														checked={cloudSettings.maskAsBackground}
														onChange={(e) => {
															updateCloudSettings(
																e.target.name,
																e.target.checked
															);
														}}
														color="secondary"
														name="maskAsBackground"
														inputProps={{
															"aria-label": "Toggle Mask as Background",
														}}
													/>
												}
												label={
													<HelpTooltip
														titles={[
															`Generates a Rap Cloud with no background, then pastes it on top of the original mask image.`,
															`This effectively makes a background out of your original mask.`,
														]}
													>
														Mask as Background
													</HelpTooltip>
												}
											/>
										</FormGroup>
									</Grid>
									<Grid
										id="contourSettings"
										item
										container
										className={classNames(
											classes.formSection,
											classes.nestedFormSection
										)}
										direction="column"
									>
										<Grid
											id="contourSettingsHead"
											item
											container
											direction="row"
											justifyContent="space-between"
											wrap="nowrap"
											alignItems="center"
										>
											<FormControlLabel
												item="true"
												control={
													<Switch
														checked={cloudSettings.contour}
														onChange={(e) => {
															updateCloudSettings(
																e.target.name,
																e.target.checked
															);
															if (parseInt(cloudSettings.contourWidth) === 0) {
																updateCloudSettings("contourWidth", 3);
															}
														}}
														disabled={
															!cloudSettings.maskId ||
															!cloudSettings.coloredBackground
														}
														color="secondary"
														name="contour"
														inputProps={{ "aria-label": "Toggle Mask Contour" }}
													/>
												}
												label={
													<HelpTooltip
														titles={[
															`Will draw a line with thickness & color of your choice around any edges detected in your mask image`,
															`This can only be used with a (solid) colored background`,
														]}
													>
														Mask Contour
													</HelpTooltip>
												}
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
													justifyContent="flex-start"
													alignContent="center"
													alignItems="center"
												>
													<TextField
														item="true"
														className={classNames(classes.oneEmMarginRight)}
														onChange={(e) =>
															updateCloudSettings(
																"contourWidth",
																e.target.value
															)
														}
														label={
															<HelpTooltip
																titles={[
																	`How thick (in pixels) you want the contour to be.`,
																	`Defaults to 1px`,
																]}
															>
																Contour Thickness
															</HelpTooltip>
														}
														id="contourWidth"
														value={cloudSettings.contourWidth}
														type="number"
														autoComplete={"off"}
													/>
													<ColorPicker
														anchorStyles={{
															backgroundColor: cloudSettings.contourColor,
															color: "#f5f5f5",
														}}
														chooseColor={(hex) => {
															updateCloudSettings("contourColor", hex);
														}}
														title={"Choose a contour color"}
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
						<Dialog
							open={fullScreenMask}
							onClose={() => toggleFullScreenMask(false)}
						>
							<DialogContent className={classes.fullScreenMaskContainer}>
								<img
									item="true"
									className={classNames(classes.fullScreenMask)}
									src={currentMask.info.secure_url}
									alt={`${currentMask.info.original_filename} Mask`}
								/>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => toggleFullScreenMask(false)}>
									Close
								</Button>
							</DialogActions>
						</Dialog>
					)}
				</Grid>
				<Grid
					id="genSettingsSection"
					container
					className={classNames(classes.formSection)}
					direction="column"
				>
					<Grid id="genSettingsSectionHead">
						<HelpTooltip
							titles={[`General settings applied to your Rap Cloud`]}
						>
							<Typography variant="h6" alignItems="left">
								General
							</Typography>
						</HelpTooltip>
					</Grid>
					<Grid
						id="genSettingsSectionBody"
						item
						container
						direction="column"
						style={{ marginTop: "1.2em" }}
					>
						<TextField
							id="cloudWidth"
							item="true"
							className={classNames(classes.oneEmMarginRight)}
							onChange={(e) => {
								let val = e.target.value;
								if (val > 2000) val = 2000;
								updateCloudSettings("width", val);
							}}
							label={
								<HelpTooltip
									titles={[`The width of the Rap Cloud to be generated`]}
								>
									Cloud Width
								</HelpTooltip>
							}
							value={cloudSettings.width}
							type="number"
							autoComplete={"off"}
						/>
						<TextField
							id="cloudHeight"
							item="true"
							className={classNames(classes.oneEmMarginRight)}
							onChange={(e) => {
								let val = e.target.value;
								if (val > 2000) val = 2000;
								updateCloudSettings("height", val);
							}}
							label={
								<HelpTooltip
									titles={[`The height of the Rap Cloud to be generated`]}
								>
									Cloud Height
								</HelpTooltip>
							}
							value={cloudSettings.height}
							type="number"
							autoComplete={"off"}
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
									inputProps={{ "aria-label": "toggle include numbers" }}
								/>
							}
							label={
								<HelpTooltip
									titles={[
										`Allows pairs of words commonly seen together to stay together.`,
										`So if "I got five on it" is repeated many times, you will see "I got", "got five", "five on", etc.`,
										`Turn this off if you want all words to stand alone, or if you're actually trying to see which words were used the most.`,
									]}
								>
									Collocations
								</HelpTooltip>
							}
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
									inputProps={{ "aria-label": "toggle include numbers" }}
								/>
							}
							label={
								<HelpTooltip
									titles={[
										`Once all words have been assigned a place, words can be used again until the entire drawable area is covered.`,
										`We recommend on, esp if using a mask image.`,
									]}
								>
									Repeat Words to Fill Picture
								</HelpTooltip>
							}
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
									inputProps={{ "aria-label": "toggle include numbers" }}
								/>
							}
							label={
								<HelpTooltip
									titles={[
										`Numbers technically aren't words, but we will still included them in you want us to`,
										`We recommend keeping this option on`,
									]}
								>
									Include Numbers
								</HelpTooltip>
							}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					className={classes.cancelBtn}
					onClick={() => toggleDialog(false)}
				>
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
						generateCloud();
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
	fonts: selectors.getSearchedFontList(state),
	fontSearchTerm: selectors.getFontSearchTerm(state),
	currentFontName: selectors.getFontSearchTerm(state),
});

export default connect(mapState, {
	updateCloudSettings,
	fetchMasks,
	deleteMask,
	resetCloudDefaults,
	fetchGoogleFonts,
	setFontSearchTerm,
	setCurrentFontName,
})(RapCloudSettings);
