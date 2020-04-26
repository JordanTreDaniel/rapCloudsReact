import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, AppBar, Button, Toolbar, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => {
    return {
        buttonBox: {
            display: "flex",       
        },
        toolBar: {
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: theme.palette.primary.light
        },
        homeLink: {
            textDecoration: "none",
            color: "black"
        }
    }
});

const Navbar = (props) => {
    const classes = useStyles();
    return (
        <AppBar color="inherit" position="static">
            <Toolbar className={classes.toolBar}>
                <Link className={classes.homeLink} to="/search">
                    <Typography variant="h6" >
                        Rap Clouds
                    </Typography>
                </Link>
                <Box className={classes.buttonBox}>
                    <Button href="/search">
                        Search
                    </Button>
                    <Button href="/signin">
                        Sign In
                    </Button>
                </Box>
                </Toolbar>
        </AppBar>
    )
	
}


export default Navbar;
