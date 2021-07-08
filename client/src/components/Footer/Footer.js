import { makeStyles } from "@material-ui/core/styles";

import { Container, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  footer: {
    //theme.palette.primary.main
    backgroundColor: "black",
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
  },
  link: {
    fontSize: "1.25em",
    color: "#fff",
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
  copylight: {
    color: "#fff",
    fontSize: "2.5vh",
    "&:hover": {
      color: theme.palette.info.main,
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        {/* <Grid container direction="column" style={{ margin: "1.2em 0" }}></Grid>
        <Grid
          item
          container
          component={"a"}
          target="_blank"
          rel="noreferrer noopener"
          justify="center"
          style={{
            textDecoration: "none",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <Typography className={classes.copylight}>
              &copy; All rights reserved , Made with &hearts; by Parteek Jain
            </Typography>
          </div>
        </Grid> */}
        <Grid container justify="center" style={{ margin: "0.7em 0" }}>
          <Typography className={classes.copylight}>
            &copy; All rights reserved , Made with &hearts; by Parteek Jain
          </Typography>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
