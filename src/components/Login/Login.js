import React, { useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { updateUser } from "../../ducks/authReducer";
import { Link } from "react-router-dom";
import "../../styles/Auth.css";
import logo from "../../imgs/logo.png";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    axios.post("/api/auth/login", { username, password }).then((res) => {
      props.updateUser(res.data);
      props.history.push("/home");
    });
  };

  return (
    <div className="login">
      <div className="login-intro">
        <img className="logo" src={logo} />
      </div>
      <div className="login-info">
        <div className="login-left">
          <p className="slogan">Just DOODL-IT</p>
          <p className="description">
            Doodl and guess <br /> the word with <br /> Friends!{" "}
          </p>
        </div>
        <div className="login-right">
          <div className="login-box">
            <h2 className="login-login">Login:</h2>
            <div className="login-input-box">
              <p>Username:</p>
              <input
                name="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="login-input-box">
              <p>Password:</p>
              <input
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="buttons">
              <button className="button" onClick={handleLogin}>
                Login
              </button>
              <Link to="/register">
                <button className="button">Register</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(null, { updateUser })(Login);
