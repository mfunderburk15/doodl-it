import React, { useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { updateUser } from "../../ducks/authReducer";
import { Link } from "react-router-dom";

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
          <button className="button" onClick={handleLogin}>
            Login
          </button>
          <Link className="button" to="/register">
            <button>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default connect(null, { updateUser })(Login);
