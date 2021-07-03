import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./components/createRoom/CreateRoom";
import Room from "./components/room/Room";
import Signin from "./components/Authentication/Signin"
import Signup from "./components/Authentication/Signup"
import ProtectedRoute from './components/Authentication/auth/ProtectedRoutes';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={CreateRoom} />
        <ProtectedRoute path="/room/:roomID" component={Room} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
