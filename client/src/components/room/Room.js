import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useHistory, useParams } from "react-router-dom";
import Peer from "simple-peer";
import styled from "styled-components";
import Base from "../Base/Base";
import { isAuthenticated } from "../Authentication/auth";

export const socket = io("https://vc-app93.herokuapp.com");

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
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const history = useHistory();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;

  useEffect(() => {
    console.log("hello");

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
        socket.emit("join room", { roomID, user });

        socket.on("user-connected", ({user, usersInThisRoom}) => {
          console.log(user);
          console.log(usersInThisRoom);
         
        });

        socket.on("all users", (users) => {
          console.log(users);
          const peers = [];
          users.forEach((user) => {
            const peer = createPeer(user.socketId, socket.id, stream);
            peersRef.current.push({
              peerID: user.socketId,
              peer,
            });
            peers.push({
              peerID: user.socketId,
              peer,
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
          const peerObj = peersRef.current.find((p) => p.socketId ===user.socketId);
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
          
          return <Video key={peer.peerID} peer={peer.peer} />;
        })}
      </Container>
    </Base>
  );
};

export default Room;
