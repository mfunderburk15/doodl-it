import axios from "axios";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { updateUser } from "../../ducks/authReducer";

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
    <div className="register">
      <div className="login-container">
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
          <button className="button" onClick={handleRegister}>
            Register
          </button>
        </div>
        <div className="if-login-div">
          <p>If you already have an account, click here:</p>
          <Link className="button" to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default connect(null, { updateUser })(Register);
