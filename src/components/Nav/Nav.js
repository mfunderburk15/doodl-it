import React, { useEffect } from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateUser, logout } from "../../ducks/authReducer";
import "../../styles/Nav.css";

function Nav(props) {
  useEffect(() => {
    axios.get("/api/auth/me").then((res) => {
      props.updateUser(res.data);
    });
  }, []);

  const handleLogout = () => {
    props.history.push("/home");
    axios.post("/api/auth/logout").then((res) => {
      props.logout();
      props.history.push("/");
    });
  };

  return (
    <div className="Nav">
      <div className="profile-container">
        <img className="profile-pic" src={props.user_img} />
        <p>{props.username}</p>
      </div>
      <div className="nav-icons">
        <Link className="nav-home" to="/home" />

        <Link className="nav-new-lobby" to="/newlobby" />
      </div>
      <Link className="nav-logout" to="/login" onClick={handleLogout} />
    </div>
  );
}

function mapStateToProps(state) {
  return state;
}

export default withRouter(
  connect(mapStateToProps, { updateUser, logout })(Nav)
);
