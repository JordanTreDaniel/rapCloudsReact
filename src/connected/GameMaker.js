import React, { useState, useEffect, Fragment } from "react";
import { Redirect, useParams, Link } from "react-router-dom";
import {
  Typography,
  AppBar,
  Toolbar,
  Grid,
  Avatar,
  Tooltip,
  Paper,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";

import { makeStyles } from "@mui/styles";
import ArtistSongList from "./ArtistSongList";
import BackButton from "../components/BackButton";
import RapCloud from "./RapCloud";
import * as selectors from "../redux/selectors";
import { searchSongs, setSongSearchTerm } from "../redux/actions";
import { connect } from "react-redux";
import paths from "../paths";
import { classNames, useWidth } from "../utils";
import LoadingBar from "../components/LoadingBar";
import DebouncedInput from "../components/DebouncedInput";
const DebouncedTextField = DebouncedInput(Input, { timeout: 639 });

const useStyles = makeStyles((theme) => {
  return {
    gameMaker: {
      height: "100vh",
      backgroundColor: theme.palette.primary.dark,
      overflow: "hidden",
    },
    mainSearchInput: {
      fontSize: "4em",
      fontWeight: 560,
      margin: ".12em 3vw .12em 9vw",
      color: theme.palette.secondary.main,
      opacity: ".72",
    },
    searchBarGrid: {},
    searchIcon: {
      color: theme.palette.secondary.dark,
      backgroundColor: theme.palette.secondary.main,
      opacity: ".72",
      marginRight: "9vw",
      "&:hover": {
        color: theme.palette.secondary.dark,
        backgroundColor: theme.palette.secondary.main,
      },
    },
    artistListGrid: {
      maxHeight: "72%",
      overflowY: "scroll",
    },
    artistAvatar: {
      width: "3.3em",
      height: "3.3em",
    },
    artistName: {
      fontSize: "2.4em",
    },
    artistLink: {
      textDecoration: "none",
      color: theme.palette.secondary.light,
      fontWeight: theme.typography.fontWeightBold,
    },
    dividers: {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main,
    },
  };
});

const GameMaker = (props) => {
  const classes = useStyles();
  const {
    setSongSearchTerm,
    searchTerm,
    searchSongs,
    artists,
    songSearchLoading,
  } = props;
  const search = () => {
    searchSongs(searchTerm);
  };
  return (
    <Grid
      className={classes.gameMaker}
      justify="center"
      container
      alignItems="flex-start"
      alignContent="flex-start"
    >
      <Grid item xs={12}>
        <Typography variant="h3" align="center" style={{ marginTop: ".5em" }}>
          Pick an artist
        </Typography>
      </Grid>
      <Grid item className={classes.searchBarGrid} xs={12}>
        <DebouncedTextField
          type="text"
          onChange={(e) => {
            const { value: newSearchTerm } = e.target;
            setSongSearchTerm(newSearchTerm);
            newSearchTerm.length && search(newSearchTerm);
          }}
          value={searchTerm}
          disableUnderline
          fullWidth
          placeholder="Search..."
          inputProps={{ className: classes.mainSearchInput }}
          rowsMax={1}
          autoFocus
          endAdornment={
            <IconButton
              className={classes.searchIcon}
              aria-label="search-icon"
              component="span"
              onClick={search}
            >
              <SearchIcon />
            </IconButton>
          }
        />
      </Grid>
      <Grid item xs={12} className={classes.artistListGrid}>
        <LoadingBar loading={songSearchLoading} />
      </Grid>
      <Grid item xs={12} className={classes.artistListGrid}>
        <List>
          <Divider className={classes.dividers} />
          {artists.map((artist, idx) => (
            <Grid key={idx}>
              <ListItem
                component={Link}
                to={`/games/${artist.id}/1`}
                className={classes.artistLink}
              >
                <ListItemAvatar>
                  <Avatar
                    src={artist.image_url}
                    alt={artist.name}
                    className={classNames(classes.artistAvatar)}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={artist.name}
                  primaryTypographyProps={{ className: classes.artistName }}
                  inset
                />
              </ListItem>
              <Divider className={classes.dividers} />
            </Grid>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

const mapState = (state) => ({
  searchTerm: selectors.getSearchTerm(state),
  songSearchLoading: selectors.isSongSearchLoading(state),
  artists: selectors.getSearchedArtistList(state),
});

export default connect(mapState, { searchSongs, setSongSearchTerm })(GameMaker);
