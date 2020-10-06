import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
	Typography,
	AppBar,
	Button,
	Toolbar,
	Box,
	Dialog,
	DialogActions,
	DialogTitle,
	List,
	ListItemText,
	ListItemIcon,
	ListItem,
	Drawer, //TO-DO: Use swipeable drawer instead
	IconButton,
	Divider,
	DialogContent
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { history } from '../redux/store';
import * as selectors from '../redux/selectors';
import { connect } from 'react-redux';
import { Avatar } from '@material-ui/core';
import paths from '../paths';
import localForage from 'localforage';
import { classNames } from '../utils';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => {
	return {
		buttonBox: {
			display: 'flex'
		},
		toolBar: {
			display: 'flex',
			justifyContent: 'space-between',
			backgroundColor: theme.palette.primary.main,
			height: '9vw'
		},
		whiteLink: {
			textDecoration: 'none',
			color: 'white'
		},
		logOutDialog: {
			textAlign: 'center',
			color: theme.palette.secondary.contrastText
		},
		logOutDialogPaper: {
			backgroundColor: theme.palette.secondary.main
		},
		logOutBtn: {
			backgroundColor: theme.palette.error.main,
			color: theme.palette.error.contrastText,
			textAlign: 'center'
		},
		cancelBtn: {
			backgroundColor: theme.palette.primary.light,
			color: theme.palette.primary.contrastText,
			textAlign: 'center'
		},
		drawer: {
			backgroundColor: theme.palette.primary.main,
			color: theme.palette.primary.contrastText
		},
		thumbnailImg: {
			width: '5em'
		},
		navList: {
			padding: 0,
			backgroundColor: theme.palette.primary.main,
			color: theme.palette.primary.contrastText
		}
	};
});

const Navbar = (props) => {
	const classes = useStyles();
	const { userImgURL, userName } = props;
	const [ logOutDialogOpen, toggleLogOutDialog ] = useState(false);
	const [ drawerOpen, toggleDrawer ] = useState(false);
	return (
		<React.Fragment>
			<AppBar color="inherit" position="static">
				<Toolbar className={classes.toolBar}>
					<Link className={classNames(classes.whiteLink)} to={paths.search}>
						<img
							alt="Rap Clouds Logo"
							src={process.env.PUBLIC_URL + '/rapClouds.png'}
							className={classes.thumbnailImg}
						/>
					</Link>
					<Box className={classes.buttonBox}>
						<IconButton onClick={() => toggleDrawer(true)}>
							<MenuIcon />
						</IconButton>
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
						<DialogTitle>{`Signed in as ${userName}`}</DialogTitle>
						<DialogContent>
							<Typography variant="h6">Log Out?</Typography>
						</DialogContent>
						<DialogActions>
							<Button
								className={classes.logOutBtn}
								autoFocus
								onClick={() => {
									localForage.clear();
									toggleLogOutDialog(false);
									history.push('/signin');
								}}
							>
								Log Out
							</Button>
							<Button className={classes.cancelBtn} autoFocus onClick={() => toggleLogOutDialog(false)}>
								Cancel
							</Button>
						</DialogActions>
					</Dialog>
				)}
			</AppBar>
			<Drawer anchor={'top'} open={drawerOpen} onClose={() => toggleDrawer(false)} className={classes.drawer}>
				<List
					component="nav"
					aria-label="main mailbox folders"
					onClick={() => toggleDrawer(false)}
					className={classes.navList}
				>
					<ListItem button onClick={() => toggleLogOutDialog(true)}>
						<ListItemText primary="Sign Out" />
						<ListItemIcon>
							{userImgURL ? (
								<Avatar alt="User Profile Pic" src={userImgURL} />
							) : (
								<Button href={paths.signIn}>Sign In</Button>
							)}
						</ListItemIcon>
					</ListItem>
					<Divider />
					<ListItem component={Link} to={paths.search} className={classNames(classes.whiteLink)}>
						<ListItemText primary={'Search'} />
						<ListItemIcon>
							<SearchIcon />
						</ListItemIcon>
					</ListItem>
					<Divider />
					<ListItem component={Link} to={paths.about} className={classNames(classes.whiteLink)}>
						<ListItemText primary="About" />
						<ListItemIcon>
							<Avatar alt="Rap Clouds Logo" src={process.env.PUBLIC_URL + '/rapClouds.png'} />
						</ListItemIcon>
					</ListItem>
					<Divider />
				</List>
			</Drawer>
		</React.Fragment>
	);
};

const mapState = (state) => ({
	userImgURL: selectors.getUserImg(state, 'small'),
	userName: selectors.getUserName(state),
	appIsHydrated: selectors.isAppRehydrated(state)
});

export default connect(mapState, null)(Navbar);
