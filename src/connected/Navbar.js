import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Typography,
	AppBar,
	Button,
	Toolbar,
	Box,
	MenuItem,
	Dialog,
	DialogTitle,
	List,
	ListItemText,
	ListItem,
	Menu,
	Tooltip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { history } from '../redux/store';
import * as selectors from '../redux/selectors';
import { connect } from 'react-redux';
import { Avatar } from '@material-ui/core';
import paths from '../paths';
import localForage from 'localforage';

const useStyles = makeStyles((theme) => {
	return {
		buttonBox: {
			display: 'flex'
		},
		toolBar: {
			display: 'flex',
			justifyContent: 'space-between',
			backgroundColor: theme.palette.primary.light
		},
		navBarLink: {
			textDecoration: 'none',
			color: 'black'
		},
		logOutDialog: {
			textAlign: 'center'
		},
		logOutDialogPaper: {
			backgroundColor: theme.palette.primary.light
		},
		logOutBtn: {
			backgroundColor: theme.palette.secondary.dark,
			color: 'white',
			textAlign: 'center'
		}
	};
});

const Navbar = (props) => {
	const classes = useStyles();
	const { userImgURL, userName } = props;
	const [ logOutDialogOpen, toggleLogOutDialog ] = useState(false);
	return (
		<AppBar color="inherit" position="static">
			<Toolbar className={classes.toolBar}>
				<Link className={classes.navBarLink} to={paths.search}>
					<Typography variant="h6">Rap Clouds</Typography>
				</Link>
				<Box className={classes.buttonBox}>
					<Link to={paths.search} className={classes.navBarLink}>
						<Button>Search</Button>
					</Link>

					{userImgURL ? (
						<Avatar alt="User Profile Pic" src={userImgURL} onClick={() => toggleLogOutDialog(true)} />
					) : (
						<Button href={paths.signIn}>Sign In</Button>
					)}
				</Box>
			</Toolbar>
			{logOutDialogOpen && (
				<Dialog
					className={classes.logOutDialog}
					onClose={() => toggleLogOutDialog(false)}
					aria-label="logOutModal"
					open={logOutDialogOpen}
					PaperProps={{ className: classes.logOutDialogPaper }}
				>
					<DialogTitle>{userName}</DialogTitle>
					<List>
						<ListItem
							className={classes.logOutBtn}
							autoFocus
							button
							onClick={() => {
								localForage.clear();
								toggleLogOutDialog(false);
								history.push('/signin');
							}}
						>
							<ListItemText primary="Log Out" />
						</ListItem>
					</List>
				</Dialog>
			)}
		</AppBar>
	);
};

const mapState = (state) => ({
	userImgURL: selectors.getUserImg(state, 'small'),
	userName: selectors.getUserName(state),
	appIsHydrated: selectors.isAppRehydrated(state)
});

export default connect(mapState, null)(Navbar);
