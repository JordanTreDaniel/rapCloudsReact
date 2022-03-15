import React from "react";
import Help from "@mui/icons-material/HelpOutline";
import { makeStyles } from "@mui/styles";
import { Tooltip, Grid, List, ListItem } from "@mui/material";

const useStyles = makeStyles({
  helpIcon: {
    marginLeft: ".33em",
  },
});

const HelpTooltip = (props) => {
  const classes = useStyles();
  const {
    children,
    titles = ["No help provided"],
    placement = "right-end",
    ...rest
  } = props;
  return (
    <Grid
      item
      container
      direction="row"
      justifyContent="flex-start"
      wrap="nowrap"
      alignItems="center"
      {...rest}
    >
      {children}
      <Tooltip
        title={
          <List>
            {titles.map((title, idx) => (
              <ListItem key={idx}>{title}</ListItem>
            ))}
          </List>
        }
        placement={placement}
        enterTouchDelay={0}
        enterNextDelay={222}
        leaveDelay={999}
        arrow
      >
        <Help className={classes.helpIcon} />
      </Tooltip>
    </Grid>
  );
};

export default HelpTooltip;
