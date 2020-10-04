import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [lobbies, setLobbies] = useState([]);

  useEffect(() => {
    axios.get("/api/lobby/getlobbies").then((res) => {
      setLobbies(res.data);
    });
  }, [lobbies]);

  const mapLobbies = lobbies.map((e, i) => {
    return (
      <Link className="lobby" to={`/api/lobby/${e.lobby_id}`} key={i}>
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

export default Home;
