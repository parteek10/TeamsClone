import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useHistory, useParams } from "react-router-dom";
import Peer from "simple-peer";
import styled from "styled-components";
import Base from "../Base/Base";
import { isAuthenticated } from "../Authentication/auth/index";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CallEndIcon from "@material-ui/icons/CallEnd";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ChatIcon from "@material-ui/icons/Chat";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MicOffIcon from "@material-ui/icons/MicOff";
// export const socket = io("http://localhost:8000");
export const socket = io("https://vc-app93.herokuapp.com");
const useStyles = makeStyles((theme) => ({
  button: {
    //margin: theme.spacing(1),
    borderRadius: "50%",
    padding: "10px",
    color: "white",
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));
const Container = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  width: 90%;
  margin: auto;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
  height: 40%;
  width: 50%;
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const Room = (props) => {
  const classes = useStyles();
  const [peers, setPeers] = useState([]);
  const [userStream, setUserStream] = useState(null);
  const videoStatus = useRef("enabled");
  const [vc, setVc] = useState("1"); // for video check
  const audioStatus = useRef("enabled");
  const [ac, setAc] = useState("1"); // for audio check
  const socketRef = useRef();
  const userVideo = useRef();
  const history = useHistory();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;

  const toggleAudio = function () {
    if (audioStatus.current === "enabled") {
      userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
      audioStatus.current = "disabled";
      setAc("0");
    } else {
      userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
      audioStatus.current = "enabled";
      setAc("1");
    }
    setUserStream(userVideo.current.srcObject);
  };

  const toggleVideo = function () {
    if (videoStatus.current === "enabled") {
      userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
      videoStatus.current = "disabled";
      setVc("0");
    } else {
      userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
      videoStatus.current = "enabled";
      setVc("1");
    }
    setUserStream(userVideo.current.srcObject);
  };
  const endCall = function () {
    socket.emit("disconnect");
  };
  useEffect(() => {
    // peer disconnect on leave
    return () => {
      history.go(0);
    };
  }, []);

  useEffect(() => {
    const { token, user } = isAuthenticated();
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        setUserStream(stream);

        socket.emit("join room", { roomID, user });

        socket.on("user-connected", ({ user, usersInThisRoom }) => {
          console.log(`{user.fname} joined room ${roomID}`);
          console.log(usersInThisRoom);
        });

        //users contains list of all other users present in the room
        socket.on("all users", (users) => {
          console.log(users);
          const peers = [];
          users.forEach((user) => {
            const peer = createPeer(user.socketId, socket.id, stream);
            peersRef.current.push({
              peerID: user.socketId,
              peer,
              fname: user.fname,
              lname: user.lname,
            });
            peers.push({
              peerID: user.socketId,
              peer,
              fname: user.fname,
              lname: user.lname,
            });
          });
          setPeers(peers);
        });

        socket.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          const peerObj = {
            peer,
            peerID: payload.callerID,
          };

          setPeers((users) => [...users, peerObj]);
        });

        socket.on("user left", (user) => {
          console.log(user);
          const peerObj = peersRef.current.find(
            (p) => p.socketId === user.socketId
          );
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter(
            (p) => p.socketId === user.socketId
          );
          peersRef.current = peers;
          setPeers(peers);
        });

        socket.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      })
      .catch((err) => {
        console.log(err);
        window.alert(
          "unable to get your media , try checking your camera connections "
        );
      });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer(
      {
        initiator: true,
        trickle: false,
        stream,
      },
      {
        host: "/",
        path: "/peer",
        // port: 8000,
        port: 443,
      }
    );

    peer.on("signal", (signal) => {
      socket.emit("sending signal", { userToSignal, callerID, signal });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer(
      {
        initiator: false,
        trickle: false,
        stream,
      },
      {
        host: "/",
        path: "/peer",
        // port: 8000,
        port: 443,
      }
    );

    peer.on("signal", (signal) => {
      socket.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <Base>
      <Container>
        <StyledVideo muted ref={userVideo} autoPlay playsInline />
        {peers.map((peer, index) => {
          return <Video key={peer.peerID} peer={peer.peer} name={peer.fname} />;
        })}
      </Container>

      <Grid container alignItems="center" justify="center">
        <div style={{ position: "fixed", bottom: "20px" }}>
          <div
            style={{
              height: "10vh",
              width: "10vw",
              marginRight: "10px",
              display: "inline",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={toggleAudio}
            >
              {audioStatus.current === "enabled" ? (
                <IconButton className={classes.button} disableRibble>
                  <KeyboardVoiceIcon />
                </IconButton>
              ) : (
                <IconButton className={classes.button} disableRibble>
                  <MicOffIcon />
                </IconButton>
              )}
            </Button>
          </div>
          <div
            style={{
              height: "10vh",
              width: "10vw",
              marginRight: "10px",
              display: "inline",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={toggleVideo}
            >
              {videoStatus.current === "enabled" ? (
                <IconButton className={classes.button} disableRibble>
                  <VideocamIcon />
                </IconButton>
              ) : (
                <IconButton className={classes.button} disableRibble>
                  <VideocamOffIcon />
                </IconButton>
              )}
            </Button>
          </div>
          <div
            style={{
              height: "10vh",
              width: "10vw",
              marginRight: "10px",
              display: "inline",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={endCall}
              className={classes.button}
            >
              <IconButton className={classes.button} disableRibble>
                <CallEndIcon />
              </IconButton>
            </Button>
          </div>
          <div
            style={{
              height: "10vh",
              width: "10vw",
              marginRight: "10px",
              display: "inline",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            >
              <IconButton className={classes.button} disableRibble>
                <ChatIcon />
              </IconButton>
            </Button>
          </div>
        </div>
      </Grid>
    </Base>
  );
};

export default Room;
