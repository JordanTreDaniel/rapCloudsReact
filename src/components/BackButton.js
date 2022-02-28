import React from "react";
import { history } from "../redux/store";
import BackIcon from "@mui/icons-material/ArrowBackOutlined";
import { makeStyles } from "@mui/styles";
import { Tooltip, IconButton } from "@mui/material";

const useStyles = makeStyles({
  backButton: {
    // position: 'fixed',
    // top: '1em',
    // left: '1em'
  },
});

const BackButton = (props) => {
  const classes = useStyles();
  return (
    <Tooltip placement="top-end" title="Go Back">
      <IconButton onClick={history.goBack} className={classes.backButton}>
        <BackIcon />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton;
