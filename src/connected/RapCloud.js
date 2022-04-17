import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
	IconButton,
	Grid,
	Tooltip,
	Paper,
	Dialog,
	DialogContent,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import Pagination from "@mui/material/Pagination";
import RapCloudSettings from "./RapCloudSettings";
import LoadingBar from "../components/LoadingBar";
import {
	classNames,
	imageInNewTab,
	downloadCloudFromUrl,
	useWidth,
} from "../utils";
import AddIcon from "@mui/icons-material/AddRounded";
import DownloadIcon from "@mui/icons-material/CloudDownload";
import NewTabIcon from "@mui/icons-material/AddToPhotos";
import XIcon from "@mui/icons-material/Cancel";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Delete from "@mui/icons-material/Delete";
import CopyIcon from "@mui/icons-material/CopyAll";
import SettingsIcon from "@mui/icons-material/Settings";
// import FacebookIcon from '@mui/icons-material/Facebook';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import TwitterIcon from '@mui/icons-material/Twitter';
import { copyCloudSettings, deleteClouds } from "../redux/actions";

const useStyles = makeStyles((theme) => {
	return {
		rapCloudsContainer: {
			height: "100%",
		},
		wordCloud: {
			margin: "auto",
			width: "100%",
			height: "100%",
			minHeight: "27vh",
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
			backgroundClip: "border-box",
			backgroundOrigin: "border-box",
		},
		wordCloudWrapper: {
			width: "100%",
			height: "100%",
			margin: "auto",
			position: "relative",
			textAlign: "center",
		},
		paginationContainerTop: {
			marginBottom: ".2em",
		},
		paginationContainerBottom: {
			marginTop: "1em",
		},
		cloudActions: {
			backgroundColor: theme.palette.primary.main,
			display: "flex",
			flexFlow: "row nowrap",
			alignItems: "center",
			justifyContent: "space-around",
			overflowX: "scroll",
			width: "100%",
		},
		cloudActionsTop: {},
		cloudActionsBottom: {},
		attnGrabber: {
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.main,
			"& a": {
				textDecoration: "none",
				color: theme.palette.secondary.main,
				backgroundColor: theme.palette.primary.dark,
			},
			"&:hover": {
				backgroundColor: theme.palette.secondary.main,
				color: theme.palette.primary.dark,
				"& a": {
					textDecoration: "none",
					backgroundColor: theme.palette.secondary.main,
					color: theme.palette.primary.dark,
				},
			},
		},
		addCloudBtn: {
			position: "absolute",
			width: "2.51em",
			height: "2.51em",
			border: `1px solid ${theme.palette.secondary.main}`,
			"& *": {
				fontSize: "1.5em",
			},
		},
		cloudAction: {
			margin: ".5em",
			width: "2em",
			height: "2em",
		},
		headerActionLink: { borderRadius: "50%" },
		darkBacking: {
			backgroundColor: theme.palette.primary.dark,
		},
		closeFullCloud: {
			position: "absolute",
			top: "-0.5em",
			right: "-0.5em",
			width: "3em",
			height: "3em",
			color: theme.palette.secondary.main,
		},
		cycleCloudsBtn: {
			position: "absolute",
			top: "40%",
			backgroundColor: "rgb(17, 145, 234, .3)",
			color: theme.palette.secondary.main,
			"&:hover": {
				backgroundColor: "rgb(17, 145, 234, .8)",
				color: theme.palette.primary.dark,
			},
		},
		cycleCloudsLeft: {
			left: "-1.2em",
		},
		cycleCloudsRight: {
			right: "-1.2em",
		},
	};
});

const RapCloud = (props) => {
	const classes = useStyles();
	const [settingsOpen, toggleSettings] = useState(false);
	const [currentCloudIdx, setCurrentCloudIdx] = React.useState(0);
	const [fullScreenCloud, toggleFullScreenCloud] = useState(false);
	const theme = useTheme();
	const width = useWidth();
	const biggerThanXS = useMediaQuery(theme.breakpoints.up("sm"));
	const {
		cloudName,
		clouds,
		top = "-1em",
		bottom,
		left = "-0.51em",
		right,
		generateCloud,
		isLoading,
		deleteClouds,
		allowDeletions = true,
		allowCreation = true,
		showCloudActions = true,
		copyCloudSettings,
	} = props;
	const cloud = clouds[currentCloudIdx];
	const { info, id: cloudId, officialCloud } = cloud || {};
	const { secure_url } = info || {};

	useEffect(() => {
		setCurrentCloudIdx(clouds.length - 1);
	}, [clouds.length]);
	const cycleClouds = (direction) => {
		let newIdx =
			direction === "left" ? currentCloudIdx - 1 : currentCloudIdx + 1;
		if (newIdx >= clouds.length) {
			newIdx = 0;
		} else if (newIdx < 0) {
			newIdx = clouds.length - 1;
		}
		setCurrentCloudIdx(newIdx);
	};
	const renderCloudActions = (place) => {
		const conditionsPassed =
			place === "bottom" ? width === "xs" : width !== "xs";
		return (
			<Paper
				elevation={0}
				id="cloudActions"
				className={` ${classes.cloudActions} ${
					conditionsPassed
						? classes.cloudActionsTop
						: classes.cloudActionsBottom
				}`}
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
						onClick={() =>
							downloadCloudFromUrl(secure_url, `${cloudName} RapCloud.png`)
						}
						className={classNames(classes.cloudAction, classes.attnGrabber)}
					>
						<DownloadIcon />
					</IconButton>
				</Tooltip>
				<Tooltip placement="bottom" title="Copy RapCloud Settings">
					<IconButton
						id="copySettingsBtn"
						onClick={() => {
							const { settings } = cloud;
							copyCloudSettings(settings);
						}}
						className={classNames(classes.cloudAction, classes.attnGrabber)}
					>
						<SettingsIcon></SettingsIcon>
						<CopyIcon></CopyIcon>
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
				{!officialCloud && allowDeletions && (
					<Tooltip placement="bottom" title="Delete Your RapCloud!">
						<IconButton
							id="deleteBtn"
							onClick={() => {
								deleteClouds([cloudId]);
							}}
							className={classNames(classes.cloudAction, classes.attnGrabber)}
						>
							<Delete />
						</IconButton>
					</Tooltip>
				)}
			</Paper>
		);
	};
	const renderPagination = (bottomSpace = false) => {
		return (
			<Grid
				id="paginationContainer"
				item
				container
				xs={12}
				justifyContent="center"
				className={
					bottomSpace
						? classes.paginationContainerBottom
						: classes.paginationContainerTop
				}
			>
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
						/>
					) : null}
				</Grid>
			</Grid>
		);
	};
	return (
		<Grid
			container
			id="rapCloudsContainer"
			className={classes.rapCloudsContainer}
		>
			{cloud && showCloudActions && renderCloudActions()}
			{renderPagination(false)}
			<Grid item container className={classNames(classes.wordCloudWrapper)}>
				<LoadingBar loading={isLoading} />
				<Grid
					item
					style={{
						backgroundImage: `url("${
							secure_url || `${process.env.PUBLIC_URL}/rapClouds.png`
						}")`,
						backgroundSize: biggerThanXS ? "contain" : "cover",
					}}
					alt={"Rap Cloud"}
					className={classes.wordCloud}
					onClick={() => toggleFullScreenCloud(true)}
				/>
				{clouds.length > 1 ? (
					<React.Fragment>
						<IconButton
							onClick={() => cycleClouds("left")}
							className={classNames(
								classes.cycleCloudsBtn,
								classes.cycleCloudsLeft
							)}
						>
							<ChevronLeft />
						</IconButton>
						<IconButton
							onClick={() => cycleClouds("right")}
							className={classNames(
								classes.cycleCloudsBtn,
								classes.cycleCloudsRight
							)}
						>
							<ChevronRight />
						</IconButton>
					</React.Fragment>
				) : null}

				{allowCreation && (
					<Tooltip placement="bottom-start" title="Creat a Rap Cloud">
						<IconButton
							onClick={() => toggleSettings(true)}
							className={classNames(classes.addCloudBtn, classes.attnGrabber)}
							style={{ top, bottom, left, right }}
						>
							<AddIcon />
						</IconButton>
					</Tooltip>
				)}
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
						{renderPagination(false)}

						<Grid
							container
							direction="row"
							justifyContent="center"
							alignItems="center"
							wrap="nowrap"
							style={{ height: "100%", position: "relative" }}
						>
							<XIcon
								className={classes.closeFullCloud}
								onClick={() => toggleFullScreenCloud(false)}
							/>
							<Grid
								id="fullScreenapCloudImage"
								item
								xs={12}
								style={{ textAlign: "center" }}
							>
								<Grid
									component="img"
									item
									src={secure_url || `${process.env.PUBLIC_URL}/rapClouds.png`}
									alt={cloudName}
									style={{ width: "90%" }}
								/>
								{clouds.length > 1 ? (
									<React.Fragment>
										<IconButton
											onClick={() => cycleClouds("left")}
											className={classNames(
												classes.cycleCloudsBtn,
												classes.cycleCloudsLeft
											)}
										>
											<ChevronLeft />
										</IconButton>
										<IconButton
											onClick={() => cycleClouds("right")}
											className={classNames(
												classes.cycleCloudsBtn,
												classes.cycleCloudsRight
											)}
										>
											<ChevronRight />
										</IconButton>
									</React.Fragment>
								) : null}
							</Grid>
						</Grid>
					</DialogContent>
				</Dialog>
			)}
			{renderPagination(true)}
		</Grid>
	);
};

export default connect(null, { deleteClouds, copyCloudSettings })(RapCloud);
