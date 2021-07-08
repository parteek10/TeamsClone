import React, { useState } from "react";
import Base from "../Base/Base";
import { socket } from "../room/Room";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Footer from "../Footer/Footer";
const useStyles = makeStyles({
  root: {
    maxWidth: 500,
  },
  media: {
    height: 300,
  },
});

const CreateRoom = (props) => {
  const classes = useStyles();
  const [lin, setLin] = useState("/");
  function create() {
    socket.emit("newMeeting");
    socket.on("newMeeting", (meetId) => {
      props.history.push(`/room/${meetId}`);
    });
  }
  return (
    <>
      <Base>
        <Container>
          <Grid container alignItems="center" justify="center">
            <Grid item xs={12} sm={6} lg={6} justify="center">
              <Card className={classes.root}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image="https://image.freepik.com/free-vector/meet-our-team-concept-landing-page_52683-11306.jpg"
                    title="Join Room"
                  />
                  <CardContent>
                    <Grid container justify="center">
                      <Typography
                        gutterBottom
                        variant="h4"
                        style={{ fontWeight: "200", fontFamily: "rockwell" }}
                        component="h2"
                      >
                        Join Room
                      </Typography>
                    </Grid>
                    {/* <Grid container justify="center">
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      Paste your room link below and start enjoying seamless
                      video call.
                    </Typography>
                  </Grid> */}
                    <Grid container justify="center">
                      <TextField
                        fullWidth
                        id="filled-textarea"
                        label="link"
                        placeholder="Placeholder"
                        multiline
                      />
                    </Grid>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Grid container alignItems="center" justify="center">
                    <Button variant="contained" color="primary">
                      Join Room
                    </Button>
                  </Grid>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} justify="center">
              <Card className={classes.root}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image="https://image.freepik.com/free-vector/meet-our-team-concept-landing-page_52683-12857.jpg"
                    title="Create your Room"
                  />
                  <CardContent>
                    <Grid container justify="center">
                      <Typography
                        gutterBottom
                        variant="h4"
                        style={{ fontWeight: "200", fontFamily: "rockwell" }}
                        component="h2"
                      >
                        Create your Room
                      </Typography>
                    </Grid>
                    <Grid container justify="center">
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Make your room and start chatting , hundreds of people
                        are already chatting , what are you waiting for ??
                      </Typography>
                    </Grid>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Grid container alignItems="center" justify="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={create}
                    >
                      Create room
                    </Button>
                  </Grid>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Base>
      <Footer></Footer>
    </>
  );
};

export default CreateRoom;
