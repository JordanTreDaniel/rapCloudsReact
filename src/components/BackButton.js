import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  return (
    <Tooltip placement="top-end" title="Go Back">
      <IconButton onClick={() => navigate(-1)} className={classes.backButton}>
        <BackIcon />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton;
