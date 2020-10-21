import React, { useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	Grid,
	withWidth,
	Tooltip,
	Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../redux/selectors';
import { updateCloudSettings } from '../redux/actions';
import { connect } from 'react-redux';
import { classNames } from '../utils';
import AddIcon from '@material-ui/icons/Add';
import { SketchPicker } from 'react-color';
const useStyles = makeStyles((theme) => {
	return {
		dialog: {
			textAlign: 'center',
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.contrastText,
			boxShadow: 'none',
		},
		dialogTitle: {
			backgroundColor: theme.palette.primary.dark,
		},
		chooseColorBtn: {
			backgroundColor: theme.palette.secondary.main,
			color: theme.palette.error.contrastText,
			textAlign: 'center',
		},
		cancelBtn: {
			backgroundColor: theme.palette.primary.light,
			color: theme.palette.primary.contrastText,
			textAlign: 'center',
		},
		settingsBtn: {
			position: 'absolute',
			backgroundColor: theme.palette.secondary.light,
			color: theme.palette.primary.dark,
		},
		addColorChip: {
			marginRight: '.3em',
			marginTop: '.3em',
			border: `1px solid ${theme.palette.primary.dark}`,
		},
	};
});

const ColorPicker = (props) => {
	const classes = useStyles();
	const { chooseColor, width } = props;
	const [ dialogOpen, toggleDialog ] = useState(false);
	const [ newColor, changeNewColor ] = useState(false);

	return (
		<React.Fragment>
			<Tooltip title="Add a Color" placement="top">
				<Chip
					className={classNames(classes.addColorChip)}
					label={<AddIcon />}
					onClick={() => toggleDialog(true)}
				/>
			</Tooltip>
			{dialogOpen && (
				<Dialog
					className={classes.dialog}
					fullScreen={width === 'xs'}
					onClose={() => toggleDialog(false)}
					aria-label="cloud-settings-dialog"
					open={dialogOpen}
				>
					<DialogTitle className={classNames(classes.dialogTitle)}>Choose a color</DialogTitle>
					<DialogContent>
						<Grid container justify="center" alignItems="center">
							<SketchPicker item color={newColor} onChange={(color) => changeNewColor(color.hex)} />
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button className={classes.cancelBtn} onClick={() => toggleDialog(false)}>
							Cancel
						</Button>
						<Button
							className={classes.chooseColorBtn}
							autoFocus
							onClick={() => {
								chooseColor(newColor);
								toggleDialog(false);
							}}
						>
							Choose This Color
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</React.Fragment>
	);
};

const mapState = (state) => ({
	cloudSettings: selectors.getCloudSettings(state),
});

export default connect(mapState, { updateCloudSettings })(withWidth()(ColorPicker));
