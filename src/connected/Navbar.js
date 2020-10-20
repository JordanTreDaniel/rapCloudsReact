import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Typography,
	AppBar,
	Button,
	Toolbar,
	Box,
	Dialog,
	DialogActions,
	DialogTitle,
	Drawer, //TO-DO: Use swipeable drawer instead
	IconButton,
	Divider,
	DialogContent,
	Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { history } from '../redux/store';
import { signOut } from '../redux/actions';
import * as selectors from '../redux/selectors';
import { connect } from 'react-redux';
import { Avatar } from '@material-ui/core';
import paths from '../paths';
import { classNames } from '../utils';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import UserIcon from '@material-ui/icons/PersonOutline';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => {
	return {
		buttonBox: {
			display: 'flex',
		},
		toolBar: {
			display: 'flex',
			justifyContent: 'space-between',
			backgroundColor: theme.palette.primary.main,
			height: '9vh',
		},
		whiteLink: {
			textDecoration: 'none',
			color: 'white',
		},
		logOutDialog: {
			textAlign: 'center',
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.secondary.contrastText,
			boxShadow: 'none',
		},
		logOutDialogTitle: {
			backgroundColor: theme.palette.primary.dark,
		},
		logOutBtn: {
			backgroundColor: theme.palette.error.main,
			color: theme.palette.error.contrastText,
			textAlign: 'center',
		},
		cancelBtn: {
			backgroundColor: theme.palette.primary.light,
			color: theme.palette.primary.contrastText,
			textAlign: 'center',
		},
		drawer: {
			backgroundColor: theme.palette.primary.main,
			color: theme.palette.primary.contrastText,
		},
		drawerItem: {
			fontSize: '2em',
			padding: '1em',
			whiteSpace: 'nowrap',
		},
		drawerItemButton: {
			backgroundColor: theme.palette.secondary.light,
			color: theme.palette.secondary.contrastText,
		},
		thumbnailImg: {
			width: '5em',
		},
		navList: {
			padding: 0,
			backgroundColor: theme.palette.primary.main,
			color: theme.palette.primary.contrastText,
		},
		appAction: {
			backgroundColor: theme.palette.secondary.main,
			color: theme.palette.primary.contrastText,
			margin: '.5em',
			width: '2em',
			height: '2em',
			'& a': {
				textDecoration: 'none',
				color: theme.palette.primary.contrastText,
				backgroundColor: theme.palette.secondary.main,
			},
			'&:hover': {
				backgroundColor: theme.palette.primary.dark,
				color: theme.palette.secondary.main,
				'& a': {
					textDecoration: 'none',
					backgroundColor: theme.palette.primary.dark,
					color: theme.palette.secondary.main,
				},
			},
		},
	};
});

const Navbar = (props) => {
	const classes = useStyles();
	const { userImgURL, userName, signOut } = props;
	const [ logOutDialogOpen, toggleLogOutDialog ] = useState(false);
	const [ drawerOpen, toggleDrawer ] = useState(false);
	return (
		<React.Fragment>
			<AppBar color="inherit" position="static">
				<Toolbar className={classes.toolBar}>
					<Link className={classNames(classes.whiteLink)} to={userName ? paths.search : paths.signIn}>
						<img
							alt="Rap Clouds Logo"
							src={process.env.PUBLIC_URL + '/rapClouds.png'}
							className={classes.thumbnailImg}
						/>
					</Link>
					<Box className={classes.buttonBox}>
						<IconButton onClick={() => toggleDrawer(true)} className={classes.appAction}>
							<MenuIcon />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
			{drawerOpen && (
				<Drawer anchor={'top'} open={drawerOpen} onClose={() => toggleDrawer(false)} className={classes.drawer}>
					<Grid
						container
						direction="column"
						wrap="nowrap"
						aria-label="main mailbox folders"
						onClick={() => toggleDrawer(false)}
						className={classes.navList}
					>
						{userName && (
							<React.Fragment>
								<Grid
									item
									container
									direction="row"
									wrap="nowrap"
									justify="space-between"
									component={Link}
									to={paths.search}
									className={classNames(classes.whiteLink, classes.drawerItem)}
								>
									<IconButton className={classes.drawerItemButton}>
										<SearchIcon />
									</IconButton>
									<Typography variant="h4">Search</Typography>
								</Grid>
								<Divider />
							</React.Fragment>
						)}

						<Grid
							item
							container
							direction="row"
							wrap="nowrap"
							justify="space-between"
							component={Link}
							to={paths.about}
							className={classNames(classes.whiteLink, classes.drawerItem)}
						>
							<Avatar
								className={classes.drawerItemButton}
								alt="Rap Clouds Logo"
								src={process.env.PUBLIC_URL + '/rapClouds.png'}
							/>
							<Typography variant="h4">About</Typography>
						</Grid>
						<Divider />
						<Grid
							item
							container
							component={userName ? 'div' : Link}
							direction="row"
							wrap="nowrap"
							justify="space-between"
							button
							onClick={userName ? () => toggleLogOutDialog(true) : null}
							to={userName ? null : paths.signIn}
							className={classNames(classes.whiteLink, classes.drawerItem)}
						>
							{userImgURL ? (
								<Avatar alt="User Profile Pic" src={userImgURL} className={classes.drawerItemButton} />
							) : (
								<IconButton className={classes.drawerItemButton}>
									<UserIcon />
								</IconButton>
							)}
							<Typography variant="h4">{userName ? `Sign Out` : `Sign In`}</Typography>
						</Grid>
						<Divider />
					</Grid>
				</Drawer>
			)}
			{logOutDialogOpen && (
				<Dialog
					className={classes.logOutDialog}
					onClose={() => toggleLogOutDialog(false)}
					aria-label="logOutModal"
					open={logOutDialogOpen}
				>
					<DialogTitle
						className={classNames(classes.logOutDialogTitle)}
					>{`Signed in as ${userName}`}</DialogTitle>
					<DialogContent>
						<Typography variant="h6">Log Out?</Typography>
					</DialogContent>
					<DialogActions>
						<Button
							className={classes.logOutBtn}
							onClick={async () => {
								signOut();
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
		</React.Fragment>
	);
};

const mapState = (state) => ({
	userImgURL: selectors.getUserImg(state, 'small'),
	userName: selectors.getUserName(state),
	appIsHydrated: selectors.isAppRehydrated(state),
});

export default connect(mapState, { signOut })(Navbar);
