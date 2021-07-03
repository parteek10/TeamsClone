import axios from 'axios';
import React, { useState } from 'react'
import './style.css'
import { Redirect } from 'react-router-dom';
import Base from '../Base/Base';
import { authenticate } from './auth';

export default function Signin() {

    const [userpost, setUser] = useState({
        email: '',
        password: '',
    });

    const [created, setCreated] = useState(false);

    const handleChange = (event) => {
        console.log(event);
        setUser({
            ...userpost,
            [event.target.name]: event.target.value
        })
    }

    const postEvent = async () => {

        try {
            const res = await axios.post(`/user/login`, userpost);
            console.log(res);
            if (res.data.error) {
                window.alert(res.data.error);
                return;
            }

            window.alert(res.data.messsage);

            authenticate({
                token:
                    res.data.token,
            });

            setCreated(true);

        } catch (err) {

            console.log(err.response.data);
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

    return (
        <Base>
            <div className="cont">
                <div className="main">
                    <h1 className="bg-dark m-2 text-white p-2 rounded">Login User</h1>
                    <div className="form">
                        <form >

                            <div controlId="">
                                <label><b>email </b></label>
                                <input className="input" type="text" name="email" value={userpost.email} onChange={handleChange} placeholder="" />
                            </div>

                            <div controlId="">
                                <label><b>  password </b></label>
                                <input className="input" type="password" name="password" value={userpost.password} onChange={handleChange} placeholder="" />
                            </div>

                            <button variant="primary" className="btn" onClick={onSubmit}>Submit</button>

                        </form>
                    </div>
                </div>
            </div>
        </Base>
    )
}
