import React, { useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {updateUser} from "../../ducks/authReducer"

function NewLobby(props) {
  
  const [lobby_name, setLobbyName] = useState("");
  const [lobby_img, setLobbyImg] = useState("");
  
  console.log(props)

  const newLobby = () => {
    axios.post("/api/lobby/create", { lobby_name, lobby_img}).then((res) => {
      console.log(res.data);
      //props.updateUser(res.data)
      props.history.push(`/lobby/${res.data[0].lobby_id}`);

    });
  };

  return (
    <section className="new-lobby">
      <h2 className="lobby-title">New Lobby</h2>
      <div className="form-input">
        <p>Lobby Name:</p>
        <input
          name="title"
          onChange={(e) => {
            setLobbyName(e.target.value);
          }}
        />
      </div>
      <img className="form-preview" src={lobby_img} />
      <div className="form-input">
        <p>Image:</p>
        <input
          name="img"
          onChange={(e) => {
            setLobbyImg(e.target.value);
          }}
        />
      </div>
      <button className="post-button" onClick={newLobby}>
        CREATE
      </button>
    </section>
  );
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps, {updateUser})(NewLobby);
