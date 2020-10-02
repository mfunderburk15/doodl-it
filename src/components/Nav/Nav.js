import React from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

function Nav(props) {
  componentDidMount = () => {
    axios.get("/api/auth/me").then((res) => {
      props.updateUser(res.data);
    });
  };
  handleLogOut = () => {
    axios.post("/api/auth/logout").then((res) => {
      props.logout();
    });
  };

  return (
    <div>
      <div>
        <img className="profile-pic" src={props.user_img} />
        <p>{props.username}</p>
      </div>
      <div>
        <Link className="nav-home" to="/home" />
        <Link className="nav-new-lobby" to="/newlobby" />
      </div>
      <button onClick={handleLogOut}>LOG OUT</button>
    </div>
  );
}

function mapStateToProps(state) {
  return state;
}

export default withRouter(
  connect(mapStateToProps, { updateUser, logout })(Nav)
);
