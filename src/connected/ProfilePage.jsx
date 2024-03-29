import React, { useEffect } from "react";
import { Typography, AppBar, Toolbar, Grid, Avatar } from "@mui/material";

import { makeStyles } from "@mui/styles";
import BackButton from "../components/BackButton";
import RapCloud from "./RapCloud";
import * as selectors from "../redux/selectors";
import { fetchClouds } from "../redux/actions";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => {
  return {
    artistPage: {
      height: "100%",
      backgroundColor: theme.palette.primary.main,
      overflow: "hidden",
    },
    buttonBox: {
      display: "flex",
    },
    toolBar: {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: theme.palette.primary.light,
    },
    artistBubbles: {
      display: "flex",
      justifyContent: "space-evenly",
    },
    leftBubbles: {
      display: "flex",
      justifyContent: "space-evenly",
    },
    lyrics: {
      whiteSpace: "pre-line",
      textAlign: "center",
    },
    mainContentChild: { width: "100%" },
    loadingDiv: {
      width: "100%",
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
      marginTop: "40%",
    },
    headerBox: {
      display: "flex",
      flexFlow: "column wrap",
      alignContent: "center",
      textAlign: "center",
      marginTop: "1em",
    },
    mainContent: {
      width: "100%",
      height: "100%",
      paddingBottom: "6em",
    },
    header: {
      color: theme.palette.primary.dark,
      fontWeight: 600,
    },
    sectionPaper: {
      padding: "1em",
      margin: "1em",
      position: "relative",
      backgroundColor: theme.palette.primary.main,
      border: `1px solid ${theme.palette.primary.light}`,
    },
    wordCloudPaper: {},
    songsPaper: {},
    sectionHeader: {
      textAlign: "center",
      fontWeight: 600,
      color: theme.palette.primary.dark,
    },
    sectionToggleBtn: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.secondary.main,
      margin: ".5em",
      width: "2em",
      height: "2em",
      position: "absolute",
      top: "-1em",
      left: "-1em",
      zIndex: 2,
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.dark,
      },
    },
    headerActionLink: { borderRadius: "50%" },
    cloudActions: {
      backgroundColor: theme.palette.primary.main,
      display: "flex",
      flexFlow: "row nowrap",
      // position: 'absolute',
      alignItems: "center",
      justifyContent: "space-around",
      overflowX: "scroll",
      width: "100%",
      padding: ".5em",
      paddingLeft: "3em",
    },
    cloudActionsTop: {},
    cloudActionsBottom: {},
  };
});

const ProfilePage = (props) => {
  const classes = useStyles();
  const { cloudsLoading, user, fetchClouds, clouds } = props;
  useEffect(() => {
    fetchClouds();
  }, [fetchClouds]);
  const { name, photo_url } = user || {};

  return (
    <Grid className={classes.artistPage}>
      <AppBar color="inherit" position="static">
        <Toolbar className={classes.toolBar}>
          <div className={classes.leftBubbles}>
            <BackButton />
            <Avatar src={photo_url} />
          </div>
        </Toolbar>
      </AppBar>
      <Grid className={classes.mainContent} container>
        <Grid item xs={12}>
          <div className={classes.headerBox}>
            <Typography variant="h3" className={classes.header}>
              {name}
            </Typography>
          </div>
        </Grid>
        <RapCloud
          generateCloud={null}
          cloudName={"Your clouds"}
          clouds={clouds}
          isLoading={cloudsLoading}
        />
        {/* <Grid item xs={12} sm={6} classes={{ root: classes.mainContentChild }}>
                    <Paper elevation={0} className={classNames(classes.wordCloudPaper, classes.sectionPaper)}>
                        <IconButton className={classes.sectionToggleBtn} onClick={toggleCloudExpanded}>
                            {cloudExpanded ? <MinusIcon /> : <AddIcon />}
                        </IconButton>
                        <Typography variant="h3" classes={{ root: classes.sectionHeader }}>
                            Cloud
						</Typography>
                        {cloudExpanded && (
                            <RapCloud
                                generateCloud={genArtistCloud}
                                cloudName={name}
                                isLoading={isArtistCloudLoading || isArtistLoading || areSongLyricsLoading}
                            />
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} classes={{ root: classes.mainContentChild }}>
                    <Paper elevation={0} className={classNames(classes.songsPaper, classes.sectionPaper)}>
                        <IconButton className={classes.sectionToggleBtn} onClick={toggleSongsExpanded}>
                            {songsExpanded ? <MinusIcon /> : <AddIcon />}
                        </IconButton>
                        <Typography variant="h3" classes={{ root: classes.sectionHeader }}>
                            Songs
						</Typography>
                        <LoadingBar loading={isArtistLoading} />
                        {songsExpanded && !isArtistLoading && <ArtistSongList artistId={artistId} />}
                    </Paper>
                </Grid> */}
      </Grid>
    </Grid>
  );
};

const mapState = (state) => ({
  user: selectors.getUser(state),
  cloudsLoading: selectors.areCloudsLoading(state),
  clouds: selectors.getCloudsForUser(state),
});

export default connect(mapState, { fetchClouds })(ProfilePage);
