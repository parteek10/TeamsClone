import axios from 'axios';
import React, { useState } from 'react';
import './style.css'

import { Redirect } from 'react-router-dom';

import Base from '../Base/Base';

// import config from "../config.json";
export default function Signup() {

    const [userpost, setUser] = useState({
        fname: '',
        lname: '',
        email: '',
        password: ''
    });

    const [created, setCreated] = useState(false);

    // const [url, setUrl] = useState("helo");

    const handleChange = (e) => {
        setUser({
            ...userpost,
            [e.target.name]: e.target.value
        })
    }

    const postEvent = async () => {

        try {
            const res = await axios.post('/register', userpost);
            console.log(res);
            window.alert(res.data.msg);
            setCreated(true);
        } catch (err) {

            console.log(err.response)
            window.alert(err.response.data.error);
            return;
        }

    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (userpost.email.trim() !== "" && userpost.password.trim !== "") {
            postEvent();
        }
        else {
            window.alert("User details are  empty");
        }
    }

    if (created) {
        return <Redirect to="/"></Redirect>
    }

    console.log(userpost);

    return (
        <Base>
            <div className="cont">
                <div className="main">
                    <h1 className="bg-dark m-2 text-white p-2 rounded"> Register User</h1>
                    <div className="form">
                        <form className="">

                            <div controlId="">
                                <label><b>fname</b></label>
                                <input className="input" type="text" name="fname" value={userpost.fname} onChange={handleChange} placeholder="" />
                            </div>

                            <div controlId="">
                                <label><b>lname </b></label>
                                <input className="input" type="text" name="lname" value={userpost.lname} onChange={handleChange} placeholder="" />
                            </div>

                            <div controlId="">
                                <label><b>email </b></label>
                                <input className="input" type="text" name="email" value={userpost.email} onChange={handleChange} placeholder="" />
                            </div>

                            <div controlId="">
                                <label><b>password </b></label>
                                <input className="input" type="password" name="password" value={userpost.password} onChange={handleChange} placeholder="" />
                            </div>
                            <button className="btn" onClick={onSubmit}>Submit</button>

                        </form>
                    </div>
                </div>
            </div>
        </Base>
    )
}
