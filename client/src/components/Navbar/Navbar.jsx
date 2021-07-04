import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import { NavLink, Link } from 'react-router-dom';
import { isAuthenticated, signout } from '../Authentication/auth';
function hello() {
    var x = document.getElementById("hell");
    if (x.className === "nav")
        x.className += " collapse";
    else
        x.className = "nav";
}

const logout = () => {
    signout();
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        color: "white",

    },
}));

export default function NavBar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" >
                <Toolbar>
                    {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton> */}
                    <Typography variant="h6" className={classes.title}>
                        <Link to="/" className={classes.title}>TeamClone </Link>
                    </Typography>


                    <Grid spacing={3}>
                        {
                            !isAuthenticated() && <NavLink activeClassName="active" to="/signin" className=" left" > <Button variant="contained">Login</Button></NavLink>
                        }
                        {
                            !isAuthenticated() && <NavLink to="/signup" activeClassName="active" className=" left" ><Button color="secondary" variant="contained">Sign Up</Button></NavLink>
                        }
                        {
                            isAuthenticated() && <Link onClick={logout} className=" left" ><Button color="secondary" variant="contained">Sign Out</Button></Link>
                        }
                    </Grid>


                </Toolbar>
            </AppBar>
        </div>
    );
}


