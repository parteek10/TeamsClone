import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import './style.css'
import Footer from "../Footer/Footer";
import { Redirect } from 'react-router-dom';
import Base from '../Base/Base';
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Signup() {
    const classes = useStyles();
    const [userpost, setUser] = useState({
        fname: '',
        lname: '',
        email: '',
        password: ''
    });

    const [created, setCreated] = useState(false);

    const handleChange = (e) => {
        setUser({
            ...userpost,
            [e.target.name]: e.target.value
        })
    }

    const postEvent = async () => {
        try {
            const res = await axios.post('/user/signup', userpost);
            console.log(res.data.message);
            window.alert(res.data.message);
            setCreated(true);
        } catch (err) {
            console.log(err.response)
            window.alert(err);
            return;
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        userpost.email = userpost.email.trim();
        userpost.password = userpost.password.trim();
        userpost.fname = userpost.fname.trim();
        userpost.lname = userpost.lname.trim();

        if (userpost.email === "" || userpost.lname === "" || userpost.fname === "" || userpost.password === "") {
            window.alert("all fields are required");
            return;
        }

        const EmailPattern = /^[A-Za-z@._0-9]+$/;
        if (!((userpost.email).match(EmailPattern) && (userpost.email).indexOf("@") !== -1 && (userpost.email).indexOf(".") !== -1 && (userpost.email).indexOf("@") + 2 < (userpost.email).indexOf("."))) {
            window.alert("enter correct email address");
            return;
        }

        var PswdPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{4,15}$/;
        if (!(userpost.password).match(PswdPattern)) {
            window.alert("Password must contain atleast 8 characters with  uppercase , lowercase and special characters ")
            return;
        }

        postEvent();

    }

    if (created) {
        return <Redirect to="/signin"></Redirect>
    }

    return (
        <>
            <Base>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <form className={classes.form} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="fname"
                                        variant="outlined"
                                        required
                                        name="fname"
                                        value={userpost.fname}
                                        onChange={handleChange}
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lname"
                                        value={userpost.lname}
                                        onChange={handleChange}
                                        autoComplete="lname"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        value={userpost.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        value={userpost.password}
                                        onChange={handleChange}
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                                        label="I want to receive inspiration, marketing promotions and updates via email."
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={onSubmit}
                                className={classes.submit}
                            >
                                Sign Up
                            </Button>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link href="/signin" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <Box mt={5}>
                        <Copyright />
                    </Box>
                </Container>
            </Base>
            <Footer></Footer>
        </>
    )
}
