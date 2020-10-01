import React from "react";
import "./App.css";
import { withRouter } from "react-router-dom";
import routes from "./routes";
import Nav from "./components/Nav/Nav";

function App() {
  return (
    <div className="App">
      {props.location.pathname === "/" ? null : <Nav />}
      {routes}
    </div>
  );
}

export default withRouter(App);
