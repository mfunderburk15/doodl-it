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
    this.socket.on('member leave', (data) => {
      this.setState({
        users:data
      })
    })
    // this.socket.on('draw', draw)  
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
    this.socket.emit('leave', {name:this.props.username, lobby:this.props.match.params.lobby_id})
    console.log("hit")
  }  

  render() {
    return (<div>Lobby</div>);
  }
}

function mapStateToProps(state) {
  return state;
}

export default withRouter(connect(mapStateToProps, { updateUser })(Lobby));
