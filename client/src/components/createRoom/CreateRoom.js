import React from "react";
import Base from "../Base/Base" ;
import {socket} from '../room/Room'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
    function create() {
        socket.emit("newMeeting");
        socket.on("newMeeting",(meetId)=>{
            props.history.push(`/room/${meetId}`);

        })
    }
    
    return (
       <Base>
    <Container>
          <Grid container alignItems="center" justify="center">
        <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="https://image.freepik.com/free-vector/meet-our-team-concept-landing-page_52683-12857.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
           Create your Room
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Make your room and start chatting , hundreds of people are already chatting , what are you waiting for ??
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
          <Grid container alignItems="center" justify="center">
       <Button variant="contained" color="primary" onClick={create} >Create room</Button>
        </Grid>
      </CardActions>
    </Card>
    </Grid>
        </Container>
       </Base>
    );
};

export default CreateRoom; 
