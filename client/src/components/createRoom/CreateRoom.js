import React from "react";
import { v1 as uuid } from "uuid";
import Base from "../Base/Base" ;

const CreateRoom = (props) => {
    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    return (
       <Base>
        <button onClick={create}>Create room</button>
       </Base>
    );
};

export default CreateRoom;
