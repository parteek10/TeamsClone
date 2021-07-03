import React from 'react';

import './Navbar.css';

import { NavLink, Link } from 'react-router-dom';
import { isAuthenticated, signout } from '../Authentication/auth';

function hello() {
    var x = document.getElementById("hell");
    if (x.className === "nav")
        x.className += " collapse";
    else
        x.className = "nav";
}

const logout = () => {
    signout();

}

const Navbar = () => {

    return (
        <>
            <nav className="nav" id="hell">
                <div className="nav-menu flex-row">
                    <div className="nav-brand">

                        <Link to="/" className="text-grey bold">
                            Teams Clone
                        </Link>

                    </div>
                    <div className="toggle-collapse">
                        <div className="toggle-icons">
                            <i className="fas fa-bars" onClick={hello}></i>
                        </div>

                    </div>

                    <div>
                        <ul className="nav-items">
                            <li className="nav-link"><NavLink exact activeClassName="active" to="/" >home</NavLink></li>
                            {/* <li className="nav-link"><NavLink exact activeClassName="active" to="/meet/create" >New meet</NavLink></li>

                            <li className="nav-link"><NavLink exact activeClassName="active" to="/join" >Join existing</NavLink></li> */}

                        </ul>

                    </div>
                    <div className="social text-grey">
                        {
                            !isAuthenticated() && <NavLink activeClassName="active" to="/signin" className=" left" >signin</NavLink>
                        }
                        {
                            !isAuthenticated() && <NavLink to="/signup" activeClassName="active" className=" left" >signup</NavLink>
                        }
                        {
                            isAuthenticated() && <Link onClick={logout} className=" left" >Signout</Link>
                        }
                    </div>

                </div>
            </nav>

        </>
    );
}

export default Navbar;
