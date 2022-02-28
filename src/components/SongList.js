import React from "react";
import { makeStyles } from "@mui/styles";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import LoadingBar from "./LoadingBar";
import { useWidth } from "../utils";

const useStyles = makeStyles((theme) => {
  return {
    songListContainer: {
      width: "100%",
      height: "80vh",
      margin: "auto",
      textAlign: "left",
      flexGrow: 5,
      overflow: "hidden",
      display: "flex",
      flexFlow: "column nowrap",
      justifyContent: "space-around",
      backgroundColor: theme.palette.primary.dark,
      maxWidth: "100vw",
      minWidth: "20em",
    },
    gridListContainer: {
      marginLeft: "1em",
      marginRight: "1em",
      flexBasis: "2",
      flexGrow: "2",
      overflowX: "hidden",
      maxHeight: "100%",
      border: `3px solid ${theme.palette.primary.light}`,
    },
    gridList: {
      width: "100%",
      maxHeight: "100%",
      backgroundColor: theme.palette.primary.dark,
    },
  };
});

const SongList = (props) => {
  const { songs, loading } = props;
  const width = useWidth();
  const classes = useStyles();
  const colsSequence = width === "xs" ? [4, 2, 2] : [4, 1, 2, 1];
  let colsIdx = 0;
  return (
    <div className={classes.songListContainer}>
      <LoadingBar loading={loading} />
      <Paper className={classes.gridListContainer} elevation={0}>
        <ImageList
          rowHeight={333}
          variant="standard"
          component="div"
          classes={{ root: classes.gridList }}
          cols={4}
        >
          {songs.map((song, idx) => {
            const artist = song.primary_artist;
            const { name: artistName = "Unknown" } = artist || {};
            const cols = colsSequence[colsIdx];
            const item = (
              <ImageListItem
                key={idx}
                cols={cols}
                component={Link}
                to={`/clouds/${song.id}`}
              >
                <img
                  src={song.header_image_thumbnail_url}
                  alt={song.full_title}
                />
                <ImageListItemBar
                  title={song.full_title}
                  subtitle={<span>by: {artistName}</span>}
                />
              </ImageListItem>
            );
            if (colsIdx === colsSequence.length - 1) {
              colsIdx = 0;
            } else {
              colsIdx++;
            }
            return item;
          })}
        </ImageList>
      </Paper>
    </div>
  );
};

SongList.defaultProps = {
  songs: [],
};

export default SongList;
