require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const socket = require("socket.io");
const shortid = require("shortid");

const server = http.Server(app);
const { ExpressPeerServer } = require("peer");

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 8000;
const expServer = server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const peerServer = ExpressPeerServer(expServer, {
  path: "/peer",
});

const Register = require("./models/registers");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
require("./db/conn");

app.use(express.json());
app.use(cookieParser());
app.use(peerServer);

app.use(express.urlencoded({ extended: false }));

const users = {};

const socketToRoom = new Set();

// const newMeet = (socket)=>{
//     console.log("new meeting request");

//     const meetId = shortid.generate();
//     socketToRoom.add(meetId);
//     users[meetId] = []
//     socket.emit("newMeeting", {
//         meetId,
//     });
// }

// const joinMeetById = (client, userId, meetId, user) => {
//     console.log(meetId,userId)
//     if (meetId && socketToRoom.has(meetId)) {
//       users[meetId].push(user);
//       client.join(meetId);
//       if (userId && user) {
//         client.emit("joined-meeting", users[meetId]);
//         client.broadcast.to(meetId).emit("user-connected", {
//           userId,
//           user,
//           users: users[meetId],
//         });
//       }
//     } else {
//       client.emit("user-connected", { error: "Invalid meeting link" });
//     }
//   };

//   const leaveMeet = (client, data) => {
//     if (data.meetId && socketToRoom.has(data.meetId)) {
//       if (users[data.meetId]) {
//         users[data.meetId].splice(
//           users[data.meetId].indexOf(data.user),
//           1
//         );
//         client.broadcast
//           .to(data.meetId)
//           .emit(
//             "user-disconnected",
//             data.id,
//             data.user,
//             users[data.meetId]
//           );
//       }
//     }
//   };

io.on("connection", (socket) => {
  socket.on("newMeeting", () => {
    const meetId = shortid.generate();
    console.log("new meet");
    console.log(meetId);
    users[meetId] = [];
    socketToRoom.add(meetId);
    socket.emit("newMeeting", meetId);
  });

  socket.on("join room", ({ roomID, user }) => {

    if(!socketToRoom.has(roomID))
    {
      return socket.emit("all users",{error:"invalid link"});
    }
    console.log(socket.id);
    user['socketId']=socket.id;
    console.log(roomID);
    console.log(user);
    users[roomID].push(user);
    socket.join(roomID);

    console.log(socketToRoom);
    console.log(users[roomID]);

    const usersInThisRoom = users[roomID].filter(
      (people) => people._id !== user._id
    );

    socket.emit("all users",usersInThisRoom);

    socket.broadcast.to(roomID).emit("user-connected", {
      user,
      usersInThisRoom,
    });

    socket.on("disconnect", () => {
        console.log("disconnect");

      console.log(socket.id);
      let room = users[roomID];
      if (room) {
        room = room.filter((people) => people.socketId !== user.socketId );
        users[roomID] = room;
      }
      socket.broadcast.to(roomID).emit("user left", user);
    });

  });

   socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });

   });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

});

app.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((currEle) => {
      return currEle.token != req.token;
    });

    const user = await req.user.save();

    res.json({ message: "logout Success" });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/register", async (req, res) => {
  if (!req.body.password || !req.body.email) {
    res.status(203).json({ message: "wrong credentials" });
  } else {
    const userData = new Register({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password,
    });
    try {
      const token = await userData.getAuthToken();
      res.cookie("jwt", token);
      const registededData = await userData.save();
      console.log("Register data : ");
      console.log(registededData);
      res.json({ message: "register successful", userData });
    } catch (err) {
      console.log(err);
      res.status(404).send(err + " error while registration");
    }
  }
});

app.post("/user/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Register.findOne({ email });
    console.log("user");
    console.log(user);

    const publicdetails = {
      fname: user.fname,
      lname: user.lname,
      _id: user._id,
    };

    const token = await user.getAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 400000),
      httpOnly: true,
    });

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch == true) {
      res.status(200).json({ isMatch, token, user: publicdetails });
    } else {
      res.status(201).send("wrong login credentials");
    }
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
