import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [lobbies, setLobbies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getLobbies();
  }, []);

  const getLobbies = () => {
    let url = "/api/getlobbies/?search=";
    if (search) {
      url += `?search=${search}`;
    }
    axios.get(url).then((res) => {
      setLobbies({
        lobbies: res.data,
      });
    });
  };

  const handleChange = (e) => {
    setSearch({
      search: e.target.value,
    });
  };

  const reset = () => {
    let url = "/api/lobby/getlobbies";
    axios.get(url).then((res) => {
      setLobbies({ lobbies: [] });
      setSearch({ search: "" });
    });
  };

  const mapLobbies = lobbies.map((e) => {
    return (
      <Link className="lobby" to={`/lobby/${e.id}`} key={e.id}>
        <div>
          <img src={e.lobby_img} />
          <h3>{e.lobby_name}</h3>
        </div>
        <div>{e.username}</div>
      </Link>
    );
  });

  return (
    <div>
      <div className="content-box">
        <div className="filter">
          <input
            className="search-bar"
            name="search"
            placeholder="Search by Title"
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <button className="search-button" onClick={getLobbies}>
            SEARCH
          </button>
          <button className="reset-button" onClick={reset}>
            RESET
          </button>
        </div>
      </div>
      <div className="lobby-box">{mapLobbies}</div>
    </div>
  );
}

export default Home;
