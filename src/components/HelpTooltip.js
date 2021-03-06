import React from 'react';
import Help from '@material-ui/icons/HelpOutline';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, Grid, List, ListItem } from '@material-ui/core';

const useStyles = makeStyles({
	helpIcon: {
		marginLeft: '.33em',
	},
});

const HelpTooltip = (props) => {
	const classes = useStyles();
	const { children, titles = [ 'No help provided' ], placement = 'right-end', ...rest } = props;
	return (
		<Grid item container direction="row" justify="flex-start" wrap="nowrap" alignItems="center" {...rest}>
			{children}
			<Tooltip
				title={<List>{titles.map((title, idx) => <ListItem key={idx}>{title}</ListItem>)}</List>}
				placement={placement}
				enterTouchDelay={0}
				enterNextDelay={222}
				interactive
				leaveDelay={999}
				arrow
			>
				<Help className={classes.helpIcon} />
			</Tooltip>
		</Grid>
	);
};

export default HelpTooltip;
