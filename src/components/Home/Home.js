import React, { useState, useEffect } from "react";
import {connect} from 'react-redux'
import { Link } from "react-router-dom";
import axios from "axios";

function Home(props) {
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    console.log(props)
    axios.get("/api/lobby/getlobbies").then((res) => {
      setLobbies(res.data);
    });
  }, []);

  const joinLobby = (lobby_id) => {
    const {user_id} = props
    axios.put(`/api/lobby/joinlobby/${lobby_id}`, {user_id}).then(res => {
      
    });
  };

  const mapLobbies = lobbies.map((e, i) => {
    return (
      <Link className="lobby" onClick={() => {joinLobby(e.lobby_id)}} to={`/lobby/${e.lobby_id}`}  key={i}>
        <div>
          <img src={e.lobby_img} />
          <h3>{e.lobby_name}</h3>
        </div>
      </Link>
    );
  });

  return (
    <div>
      <div className="lobby-box">{mapLobbies}</div>
    </div>
  );
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps) (Home);
