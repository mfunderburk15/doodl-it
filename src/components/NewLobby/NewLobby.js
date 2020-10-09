import React, { useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import "../../styles/NewLobby.css";

function NewLobby(props) {
  const [lobby_name, setLobbyName] = useState("");
  const [lobby_img, setLobbyImg] = useState("");

  console.log(props);

  const newLobby = () => {
    axios.post("/api/lobby/create", { lobby_name, lobby_img }).then((res) => {
      props.history.push(`/lobby/${res.data[0].lobby_id}?creator=true`);
    });
  };

  return (
    <section className="new-lobby">
      <div className="new-lobby-container">
        <h2 className="lobby-title">New Lobby:</h2>
        <div className="new-input-box">
          <p>Lobby Name:</p>
          <input
            name="title"
            onChange={(e) => {
              setLobbyName(e.target.value);
            }}
          />
        </div>
        <img className="new-preview" src={lobby_img} />
        <div className="new-input-box">
          <p>Image:</p>
          <input
            name="img"
            onChange={(e) => {
              setLobbyImg(e.target.value);
            }}
          />
        </div>
        <button className="button" onClick={newLobby}>
          CREATE
        </button>
      </div>
    </section>
  );
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(NewLobby);
