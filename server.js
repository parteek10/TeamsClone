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

io.on("connection", (socket) => {
	socket.on("newMeeting", () => {
		const meetId = shortid.generate();
		console.log("new meeting : ");
		console.log(meetId);
		users[meetId] = [];
		socketToRoom.add(meetId);
		socket.emit("newMeeting", meetId);
	});

	socket.on("join room", ({ roomID, user }) => {

		if (!socketToRoom.has(roomID)) {
			return socket.emit("all users", { error: "invalid link" });
		}
		if (!user) {
			return socket.emit("error");
		}

		user['socketId'] = socket.id;

		console.log(`${user.fname} joined room ${roomID}`)
		users[roomID].push(user);
		socket.join(roomID);

		const usersInThisRoom = users[roomID].filter(
			(people) => people._id !== user._id
		);

		socket.emit("all users", usersInThisRoom);

		socket.broadcast.to(roomID).emit("user-connected", {
			user,
			usersInThisRoom,
		});

		socket.on("disconnect", () => {
			console.log("disconnect");
			console.log(socket.id);
			let room = users[roomID];
			if (room) {
				room = room.filter((people) => people.socketId !== user.socketId);
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

		res.status(200).json({ message: "logout Success", user });
	} catch (error) {
		res.status(400).send(error);
	}
});

app.post("/user/signup", async (req, res) => {

	try {
		const userData = new Register({
			fname: req.body.fname,
			lname: req.body.lname,
			email: req.body.email,
			password: req.body.password,
		});

		const token = await userData.getAuthToken();
		res.cookie("jwt", token);
		const registededData = await userData.save();

		console.log(`${req.body.fname} registered succefully `)

		res.json({ message: "You are registered successfully . Please Sign In to access the services", userData });
	} catch (err) {
		res.status(403).send(err);
	}
});

app.post("/user/signin", async (req, res) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		const user = await Register.findOne({ email });

		const token = await user.getAuthToken();

		res.cookie("jwt", token);

		const isMatch = await bcrypt.compare(password, user.password);

		if (isMatch == true) {
			const publicDetails = {
				fname: user.fname,
				lname: user.lname,
				_id: user._id,
			};
			res.status(200).json({ isMatch, token, user: publicDetails });
		} else {
			res.status(401).json({ isMatch, err: "incorrect password" });
		}

	} catch (err) {
		console.log(err);
		res.status(401).json({ isMatch: false, err: "wrong credentials" });
	}
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
	const path = require("path");
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}
