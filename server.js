require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});


const Register = require("./models/registers");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
require("./db/conn")

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));


const users = {};

const socketToRoom = {};

io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});



// server.get("/", (req, res) => {
//     res.render("index");
// })

// server.get("/register", (req, res) => {
//     res.render("register");
// })

// server.get("/secret", auth, (req, res) => {
//     res.render("secret");
// })

app.get("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currEle) => {
            return currEle.token != req.token
        });

        const user = await req.user.save();

        res.json({ "message": "logout Success" });
        // res.render("login");

    } catch (error) {
        res.status(400).send(error);
    }
})

app.post("/register", async (req, res) => {
    console.log(req.body);
    if (!req.body.password || !req.body.email) {
        res.status(203).json({ message: "wrong credentials" });
        // res.status(203).send(`${req.body.password}  ${req.body.confirmPassword} are not smae `);
    }
    else {
        const userData = new Register({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: req.body.password
        });
        try {
            const token = await userData.getAuthToken();
            res.cookie("jwt", token);
            const registededData = await userData.save();
            console.log("Register data : ");
            console.log(registededData);
            res.json({ message: "register successful", userData })
            // res.render("index");
        } catch (err) {
            console.log(err);
            res.status(404).send(err + " error while registration");
        }
    }
})

// app.get("/login", (req, res) => {
//     res.render("login");
// })

app.post("/user/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await Register.findOne({ email });
        const token = await user.getAuthToken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 400000),
            httpOnly: true
        });

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch == true) {
            // res.status(200).render("index");
            res.status(200).json({ isMatch, token })
        } else {
            res.status(201).send("wrong login credentials")
        }
    }
    catch (err) {
        console.log(err);
        res.status(401).send(err);
    }
})


server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}
