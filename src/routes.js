import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

//component imports
import Home from "./components/Home/Home";
import NewLobby from "./components/NewLobby/NewLobby";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Lobby from "./components/Lobby/Lobby";
import Admin from "./components/Admin/Admin";

export default (
  <Switch>
    <Route path="/home" component={Home} />
    <Route path="/lobby/:lobby_id" component={Lobby} />
    <Route path="/admin" component={Admin} />
    <Route path="/newlobby" component={NewLobby} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/" component={() => <Redirect to="/login" />} />
    <Route path="*" component={() => "404 NOT FOUND"} />
  </Switch>
);
