import React, { Component } from "react";
import io from "socket.io-client";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { updateUser } from "../../ducks/authReducer";



class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users:[],
      user: null,
      context: null,
      canvas: null,
      click: false,
    };
    this.socket = io.connect();
    this.socket.on('member join', (data) => {
    this.setState({
      users:data
    })
    // this.socket.on('draw', draw)  
      console.log(data)
    })
    this.socket.on('member leave', (data) => {
      this.setState({
        users:data
      })
      console.log(data)
    })
    
  }
  componentDidMount() {
    console.log(this.props)
    this.setState({
      user: this.props.username,
    });
    this.socket.emit('join', {name:this.props.username, lobby:this.props.match.params.lobby_id});
  }

  
  componentWillUnmount(){
    console.log("hit")
    this.socket.emit('leave', {name:this.props.username, lobby:this.props.match.params.lobby_id})
  }
  
 

  render() {
    const mappedUsers = this.state.users.map((e, i) => {
      return(
        <p className="users-in-lobby" key={i}>{e}</p>
      )
    })
    return (<div className="lobby">
      <div className="row">
        <canvas class="canvas"></canvas>
        <div className="users">
        <ul>{mappedUsers}</ul>
          <div className="guesses"></div>
          <div className="draw-buttons">
          <button value="0" class="clear" type="button">X</button>
                <button value="#000000" class="black" type="button"></button>
                <button value="#0000EE" class="blue" type="button"></button>
                <button value="#66CD00" class="green" type="button"></button>
                <button value="#FF0000" class="red" type="button"></button>
                <button value="#FFFF00" class="yellow" type="button"></button>
                <button value="white" class="white" type="button"></button>
          </div>
        </div>
        <div className="top-message">
          <div className="draw hidden">
            <p>The secret word is: <span className="word"></span></p>
          </div>
          <form>
            Guess the word! <input name="guess" class="guess-input" type="text" />
          </form>
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps(state) {
  return state;
}

export default withRouter(connect(mapStateToProps, { updateUser })(Lobby));
