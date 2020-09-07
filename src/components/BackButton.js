import React from 'react';
import { history } from '../redux/store';
import BackIcon from '@material-ui/icons/ArrowBackOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton } from '@material-ui/core';

const useStyles = makeStyles({
	backButton: {
		// position: 'fixed',
		// top: '1em',
		// left: '1em'
	}
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
