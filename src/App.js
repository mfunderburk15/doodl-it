import React from "react";
import "./styles/reset.css"
import "./styles/App.css";
import { withRouter } from "react-router-dom";
import routes from "./routes";
import Nav from "./components/Nav/Nav";

function App(props) {
  return (
    <div className="App">
      {props.location.pathname === "/login" ||
      props.location.pathname === "/register" ? null : (
        <Nav />
      )}
      {routes}
    </div>
  );
}

export default withRouter(App);
