import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import RapCloud from "../connected/RapCloud";
import { QuizBox } from "../connected/ArtistGame";
import FlyWithMe from "../components/FlyWithMe";
import paths from "../paths";
import {
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import { classNames, useWidth } from "../utils";
import RightArrow from "@mui/icons-material/ArrowForward";
import CloudQueue from "@mui/icons-material/CloudQueue";
import { Instagram, Style } from "@mui/icons-material";

const useStyles = makeStyles((theme) => {
  return {
    aboutPageContainer: {
      minWidth: "100%",
      minHeight: "91vh",
      maxWidth: "100vw",
      backgroundColor: theme.palette.primary.dark,
    },
    demoButtons: {
      position: "absolute",
      padding: "1em",
      textAlign: "center",
      borderRadius: "6px",
    },
    demoButtonsDesktop: {
      padding: "1em",
      bottom: ".6em",
      right: "1em",
    },
    demoButtonsMobile: {
      padding: "0",
      bottom: "0",
      right: "0",
    },
    demoButton: {
      fontSize: "1.2em",
      fontWeight: theme.typography.fontWeightBold,
      whiteSpace: "nowrap",
      margin: ".5em",
      marginRight: ".5em",
      marginLeft: ".5em",
      boxShadow: "none",
      border: `1px solid ${theme.palette.primary.dark}`,
      cursor: "pointer",
      zIndex: "3",
    },
    makeACloudBtn: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
      },
    },
    playTheGameBtn: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      opacity: ".8",
      "&:hover": {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,
      },
    },
    fullSection: {
      // minWidth: '100%',
      // minHeight: '100%',//Why doesn't 100% work?
      minHeight: "91vh",
      paddingLeft: "3em",
      paddingRight: "3em",
      padding: "1em",
    },
    centeredColumn: {
      display: "flex",
      flexFlow: "column wrap",
      justifyContent: "center",
      alignItems: "stretch",
    },
    centeredRow: {
      display: "flex",
      flexFlow: "row wrap",
      justifyContent: "center",
      alignItems: "center",
    },
    backgroundVideo: {
      position: "absolute",
      right: 0,
      bottom: 0,
      minWidth: "100%",
      height: "91vh", //TO-DO: Get it so that the MINIMUM height is 91vh, and it grows to cover the answer section on mobile
    },
    backgroundVideoBox: { position: "relative" },
    whatIsAWordCloud: {},
    questionSection: {
      color: theme.palette.primary.contrastText,
      padding: "1em",
      zIndex: "2",
      backgroundColor: "rgba(0, 0, 0, 0.333)",
    },
    answerSection: {
      paddingTop: "2em",
      paddingBottom: "2em",
      padding: "1em",
      // minHeight: '91vh',
      lineHeight: "5em",
      zIndex: "2",
      textAlign: "center",
      backgroundColor: "rgba(0, 0, 0, 0.333)",
    },
    explanationSection: {
      marginTop: "2em",
      marginBottom: "2em",
      padding: "1em",
      // minHeight: '72vh',
    },
    lightBlueTxt: {
      color: theme.palette.secondary.light,
    },
    mainBlueText: {
      color: theme.palette.secondary.main,
    },
    greyText: {
      color: theme.palette.primary.main,
    },
    bold: {
      fontWeight: theme.typography.fontWeightBold,
    },
    growVertically: {
      overflowY: "fit-content",
      height: "fit-content",
    },
    exampleCloud: {
      backgroundImage: `url("${process.env.PUBLIC_URL}/Heaven Rap Cloud.png")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      backgroundSize: "contain",
    },
    fullScreenExample: { backgroundColor: theme.palette.primary.main },
    lyricQuote: {
      paddingLeft: "3em",
      paddingRight: "3em",
      marginTop: "3em",
      marginBottom: "3em",
    },
    plainLink: {
      color: theme.palette.primary.contrastText,
      cursor: "pointer",
    },
    flipped: {
      transform: "rotate(180deg)",
    },
    creativeThinkingBox: {
      backgroundImage: `url("${process.env.PUBLIC_URL}/Creative Thinking.gif")`,
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "100%",
    },
    rapCloudsContainer: {
      height: "72vh",
    },
    playTheGameSection: {
      backgroundColor: theme.palette.primary.main,
    },
    makeACloudSection: {
      paddingBottom: "6em",
    },
  };
});
const sampleCloudFiles = ["bodyToMe.png", "rightHand.png", "loveCycle.png"];
const LandingPage = (props) => {
  const { user } = props;
  const width = useWidth();
  const classes = useStyles();
  const [sampleAnswerIdx, setSampleAnswerIdx] = useState(null);

  return (
    <Grid
      id="aboutPageContainer"
      container
      classes={{ root: classes.aboutPageContainer }}
      elevation={0}
    >
      <FlyWithMe>
        <Grid
          id="questionSection"
          item
          container
          alignItems={width === "xs" ? "flex-start" : "center"}
          xs={12}
          className={classNames(
            classes.questionSection,
            classes.fullSection,
            classes.whatIsAWordCloud
          )}
        >
          <Grid item id="welcomeMsgContainer">
            <Typography
              variant="h2"
              className={classes.lightBlueTxt}
              style={{ marginTop: "1em" }}
            >
              Welcome to
            </Typography>
            <Typography variant="h1">
              <span className={classNames(classes.greyText, classes.bold)}>
                Rap Clouds
              </span>
            </Typography>
          </Grid>
        </Grid>
        <Grid
          id="demoButtonsBox"
          item
          container
          xs={12}
          sm={9}
          direction="row"
          wrap="wrap"
          justifyContent="flex-end"
          className={classNames(
            classes.demoButtons,
            width === "xs"
              ? classes.demoButtonsMobile
              : classes.demoButtonsDesktop
          )}
        >
          <Button
            variant="contained"
            item
            component={Link}
            to={user ? paths.play : paths.signIn}
            color="primary"
            disableElevation
            endIcon={<Style className={classes.flipped} />}
            className={classNames(classes.demoButton, classes.playTheGameBtn)}
          >
            Play the Game
          </Button>
          <Button
            variant="contained"
            item
            component={Link}
            to={user ? paths.search : paths.signIn}
            color="secondary"
            disableElevation
            endIcon={<CloudQueue />}
            className={classNames(classes.demoButton, classes.makeACloudBtn)}
          >
            Make a Cloud
          </Button>
        </Grid>
      </FlyWithMe>
      <Grid
        id="playTheGame"
        container
        spacing={3}
        justifyContent="space-around"
        alignItems="space-around"
        alignContent="space-around"
        direction="row"
        className={classNames(
          classes.fullSection,
          classes.growVertically,
          classes.playTheGameSection
        )}
      >
        <Grid item container xs={12} sm={4} style={{ marginTop: "3em" }}>
          <Grid
            item
            container
            xs={12}
            alignItems="flex-start"
            alignContent="flex-start"
            justifyContent="flex-start"
          >
            <Typography
              variant="h4"
              className={classNames(classes.bold, classes.lightBlueTxt)}
            >
              Test your lyrical knowledge
            </Typography>
            <br />
            <List component="ol" dense>
              <ListItem>
                <ListItemText>
                  1. Pick an artist{" "}
                  <span role="img" aria-label="Pick artist emoji">
                    🎤🎙
                  </span>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  2. Look at the RapCloud
                  <span role="img" aria-label="Look at rapCloud emoji">
                    🧐
                  </span>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  3. Guess the right answer before time runs out!
                  <span role="img" aria-label="Guess the song emojis">
                    🤓✅
                  </span>
                </ListItemText>
              </ListItem>
            </List>
            <Button
              id="demoButtonsBox"
              component={Link}
              to={user ? "/play" : "/signin"}
              color="secondary"
              disableElevation
              endIcon={<Style className={classes.flipped} />}
              variant="contained"
              className={classes.demoButton}
            >
              Play the Game
            </Button>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          className={classNames(
            classes.gameDemoContainer,
            classes.growVertically
          )}
        >
          <QuizBox
            question={{
              answers: [
                { correct: false, title: `Marvin's Room by Drake` },
                { correct: false, title: `Right Hand by Drake` },
                { correct: true, title: `God's Plan by Drake` },
                { correct: false, title: `Hotline Bling by Drake` },
              ],
              answerIdx: sampleAnswerIdx,
              song: { id: 3315890, title: `God's Plan by Drake` },
              cloud: {
                info: { secure_url: `${process.env.PUBLIC_URL}/godsPlan.png` },
              },
            }}
            gameId={null}
            questionIdx={0}
            updateQuestionIdx={() => null}
            answerQuestion={(_, __, i) => setSampleAnswerIdx(i)}
            answersOnBottomOnly={true}
          />
        </Grid>
      </Grid>
      <Grid
        id="makeACloud"
        container
        spacing={3}
        justifyContent="space-around"
        alignItems="space-around"
        alignContent="space-around"
        direction="row-reverse"
        className={classNames(
          classes.fullSection,
          classes.growVertically,
          classes.makeACloudSection
        )}
      >
        <Grid item container xs={12} sm={4} style={{ marginTop: "3em" }}>
          <Grid
            item
            xs={12}
            alignItems="flex-start"
            alignContent="flex-start"
            justifyContent="flex-start"
          >
            <Typography
              variant="h4"
              className={classNames(classes.bold, classes.mainBlueText)}
            >
              Make custom Rap Clouds
            </Typography>
            <br />
            <List component="ol" dense>
              <ListItem>
                <ListItemText>
                  1. Pick a song
                  <span role="img" aria-label="Pick a song emojis">
                    🎵🎶
                  </span>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  2. Choose a picture, some colors, and style
                  <span role="img" aria-label="Choose your styling emojis">
                    🎨🖌
                  </span>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  3. Download it for FREE
                  <span role="img" aria-label="Download it free emojis">
                    🤑
                  </span>
                </ListItemText>
              </ListItem>
            </List>
            <Button
              component={"a"}
              target="_blank"
              rel="noopener noreferrer"
              href={"https://www.instagram.com/therealrapclouds/"}
              color="primary"
              disableElevation
              endIcon={<Instagram />}
              variant="contained"
              className={classes.demoButton}
            >
              RapClouds Instagram
            </Button>
            <Button
              id="demoButtonsBox"
              component={Link}
              to={user ? "/search" : "/signin"}
              color="secondary"
              disableElevation
              endIcon={<RightArrow />}
              variant="contained"
              className={classes.demoButton}
            >
              Search Songs
            </Button>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          className={classNames(
            classes.rapCloudsContainer,
            classes.growVertically
          )}
        >
          <RapCloud
            generateCloud={null}
            cloudName={"Example Clouds"}
            clouds={sampleCloudFiles.map((fileName) => {
              return {
                info: { secure_url: `${process.env.PUBLIC_URL}/${fileName}` },
              };
            })}
            isLoading={false}
            allowDeletions={false}
            allowCreation={false}
            showCloudActions={false}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

LandingPage.defaultProps = {
  songs: [],
};

export default LandingPage;
