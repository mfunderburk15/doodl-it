import axios from "axios";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { updateUser } from "../../ducks/authReducer";
import logo from "../../imgs/logo.png";
import "../../styles/Auth.css";

function Register(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    axios
      .post("/api/auth/register", { username, password })
      .then((res) => {
        props.updateUser(res.data);
        props.history.push("/home");
      })
      .catch((err) => {
        alert(err.message);
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
            <h2 className="login-login">Register:</h2>
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
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="buttons">
              <button className="button" onClick={handleRegister}>
                Register
              </button>
              <Link to="/login">
                <button className="button">Login</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(null, { updateUser })(Register);
