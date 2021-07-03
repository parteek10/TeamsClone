import React from "react";
import { v1 as uuid } from "uuid";
import Base from "../Base/Base" ;
import {socket} from '../room/Room'

const CreateRoom = (props) => {
    function create() {

        socket.emit("newMeeting");
        socket.on("newMeeting",(meetId)=>{
            props.history.push(`/room/${meetId}`);

        })
    }
    
    return (
       <Base>
        <button onClick={create}>Create room</button>
       </Base>
    );
};

export default CreateRoom; 
