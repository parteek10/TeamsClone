const users = {};
const chats = {};
const socketToRoom = new Set();
const shortid = require("shortid");

//newt meeting
exports.newMeeting = (socket)=>{

    const meetId = shortid.generate();
    console.log("new meeting : ");
    console.log(meetId);
    users[meetId] = [];
    socketToRoom.add(meetId);
    socket.emit("newMeeting", meetId);

}

exports.joinMeetbyId=(socket,roomId,user)=>{

    if (!socketToRoom.has(roomID)) {
      return socket.emit("error", { message: "invalid link" });
    }
    if (!user) {
      return socket.emit("error",{message:"user not found"});
    }

    user["socketId"] = socket.id;
    console.log(`${user.fname} joined room ${roomID}`);
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
}

exports.leaveMeeting=(socket,roomID,user)=>{

    console.log(socket.id);
    let room = users[roomID];
    if (room) {
      room = room.filter((people) => people.socketId !== user.socketId);
      users[roomID] = room;
    }
    socket.broadcast.to(roomID).emit("user left", user);

}
