import React, { Component } from "react";
import io from "socket.io-client";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { updateUser } from "../../ducks/authReducer";
import Canvas from "../Canvas/Canvas";
import axios from "axios";
import queryString from "query-string";
import "../../styles/lobby.css";

const totalRounds = 15;

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      room: {
        lobby_id: null,
        players: [],
        drawHistory: [],
        currentRound: 1,
        words: [],
        currentWord: "",
        currentPlayer: 0,
      },
      user: null,
      guessedWord: "",
      words: [],
      backToHome: false,
    };
    this.socket = io.connect();
    this.socket.on("member joined", (data) => {
      this.setState({
        room: data,
      });
      console.log(data);
    });

    this.socket.on("member leave", (data) => {
      console.log("hit");
      this.setState({
        room: data,
      });
      // if(this.state.room.players === []){
      //   axios.delete
      // }
      console.log(data);
    });

    this.socket.on("next round", (data) => {
      this.setState({
        room: data,
      });
      console.log(data);
    });
  }

  componentDidMount() {
    const { creator } = queryString.parse(this.props.location.search);
    const { user_id, username, user_img, is_creator, lobby_id } = this.props;
    this.props.updateUser({
      user_id,
      username,
      user_img,
      is_creator,
      lobby_id,
    });
    console.log(this.props);
    if (creator) {
      console.log("hit it");
      axios.get("/api/words/get").then((res) => {
        const shuffled = res.data.sort(() => {
          return 0.5 - Math.random();
        });

        let selected = shuffled.slice(0, totalRounds);

        const wordsMapped = selected.map((word) => {
          return word.word;
        });

        this.socket.emit("initiate lobby", {
          lobby_id: this.props.match.params.lobby_id,
          name: this.props.username,
          words: wordsMapped,
        });
      });
    } else {
      console.log("hit else");
      this.socket.emit("member join", {
        lobby_id: this.props.match.params.lobby_id,
        name: this.props.username,
      });
    }
  }

  componentWillUnmount() {
    const { user_id } = this.props;
    axios.put("/api/lobby/leavelobby", { user_id }).then((res) => {});

    console.log("hit");
    this.socket.emit("leave", {
      name: this.props.username,
      lobby_id: this.props.match.params.lobby_id,
    });
    this.socket.close();
  }

  handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({
      [name]: value,
    });
  };

  handleGuess = (e) => {
    console.log(this.state.guessedWord);
    e.preventDefault();
    if (this.state.room.currentWord === this.state.guessedWord) {
      console.log("correct");
      this.socket.emit("successful guess", {
        name: this.props.username,
        lobby_id: this.props.match.params.lobby_id,
      });
    } else {
      alert("guess again");
    }

    //resetting the value of input
    this.setState({
      guessedWord: "",
    });
  };

  successfulGuess = () => {
    this.socket.emit("successful guess", {
      name: this.props.username,
      lobby_id: this.props.match.params.lobby_id,
    });
  };

  // nextRound = () => {
  //   const lastRound = this.state.currentRound
  //   const words = this.state.words

  //   if(lastRound + 1 < totalRounds){
  //     this.setState({
  //       currentRound: lastRound + 1,
  //       word: words[lastRound]
  //     })
  //   }else{
  //     this.endLobby()
  //   }
  // }

  // endLobby = () => {
  //   !this.state.backToHome
  // }

  // destroyLobby = () =>{

  //   if(this.state.users.length === []){
  //     axios.delete(`/api/lobby/delete/${this.lobby_id}`, this.lobby_id)
  //   }

  // }
  // queryString.parse(this.props.location.search).creator
  render() {
    const mappedUsers = this.state.room.players.map((e, i) => {
      return (
        <p className="users-in-lobby" key={i}>
          {e.username}
        </p>
      );
    });
    return (
      <div className="in-lobby">
        <h3 className="welcome-message"> Welcome to the game!</h3>
        <p className="round-counter">
          Round: {this.state.room.currentRound} of {totalRounds}
        </p>
        {this.state.room.players.length > 0 &&
          this.props.username ===
            this.state.room.players[this.state.room.currentPlayer].username && (
            <p className="doodl-it">
              Doodl the word: <strong>{this.state.room.currentWord}</strong>
            </p>
          )}
        <div className="fun-stuff">
          <Canvas
            lobby={this.state.room.lobby_id}
            socket={this.socket}
            is_creator={
              this.state.room.players.length > 0 &&
              this.props.username ===
                this.state.room.players[this.state.room.currentPlayer].username
            }
          />
          <div className="users">
            <ul className="mapped-users">{mappedUsers}</ul>
          </div>
        </div>
        {this.state.room.players.length > 0 &&
          this.props.username !==
            this.state.room.players[this.state.room.currentPlayer].username && (
            <div>
              <input
                type="text"
                className="Guess"
                placeholder="Guess the word!"
                onChange={this.handleChange}
                value={this.state.guessedWord}
                name="guessedWord"
              />
              <button className="button" onClick={this.handleGuess}>
                Submit
              </button>
            </div>
          )}
        {/* {!this.state.backToHome ? null : <div className="go-home">
        <p>Game is finished!</p>
        <button onClick={()=>{this.destroyLobby}}> Okay</button></div>} */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default withRouter(connect(mapStateToProps, { updateUser })(Lobby));
