import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import "../../styles/Home.css";

function Home(props) {
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    console.log(props);
    axios.get("/api/lobby/getlobbies").then((res) => {
      setLobbies(res.data);
    });
  }, []);

  const joinLobby = (lobby_id) => {
    const { user_id } = props;
    axios.put(`/api/lobby/joinlobby/${lobby_id}`, { user_id }).then((res) => {
      props.history.push(`/lobby/${lobby_id}`);
    });
  };

  const mapLobbies = lobbies.map((e, i) => {
    return (
      <div
        className="lobby"
        onClick={() => {
          joinLobby(e.lobby_id);
        }}
        key={i}
      >
        <div>
          <img className="lobby-img" src={e.lobby_img} />
          <h3 className="lobby-title">{e.lobby_name}</h3>
        </div>
      </div>
    );
  });

  return (
    <div className="Home">
      <div className="lobby-box">
        <p>Active Lobbies: </p>
        {mapLobbies}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Home);
