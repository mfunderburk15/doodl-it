import React, { Component } from "react";
import io from "socket.io-client";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { updateUser } from "../../ducks/authReducer";
import Canvas from "../Canvas/Canvas"
import axios from "axios";


const totalRounds = 3

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users:[],
      user: null,
      guessedWord:"",
      currentRound:1,
      score:0,
      currentWord: null,
      words:[]
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
    
    this.user_id=this.props.user_id
    this.username = this.props.username
    this.lobby_id = this.props.match.params.lobby_id
    this.is_creator = this.props.is_creator
    this.currentWord="missed"
    this.currentRound=1;
    this.words = []
    console.log(this.props)
  }

  componentDidMount() {
    if(this.is_creator){
      axios.get("/api/words/get").then((res) => {
        const shuffled = res.data.sort(() => { return 0.5 - Math.random()})

        let selected = shuffled.slice(0, totalRounds)

        const wordsMapped = selected.map((word) => {return word.word})
        this.setState({
          words: wordsMapped,
          word: wordsMapped[0]
        })
        this.socket.emit('initiate lobby', {
          lobby_id: this.lobby_id,
          players:[{
            username: this.username,
            score: 0,
            is_creator: true
          }],
          drawHistory:[],
          currentRound: 1,
          words: wordsMapped,
          currentWord: wordsMapped[0],
        });
      })
    } else{
      this.socket.emit('join', {name:this.username, lobby:this.lobby_id})
      this.socket.on('joined', (data) => {
        console.log(data)
        this.currentWord = data.current.currentWord
        this.currentRound = data.currentRound
        this.words = data.words
        this.setState({
          currentWord: data.currentWord,
          currentRound: data.currentRound,
          words: data.words
        })
        console.log('joined')
      })
    }
    this.setState({
      user: this.username,
    });
    this.socket.emit('join userlist', {name:this.username, lobby:this.lobby_id});
  }

  
  componentWillUnmount(){
    console.log("hit")
    this.socket.emit('leave', {name:this.props.username, lobby:this.props.match.params.lobby_id})
    this.socket.close()
  }
  
  successfulGuess(){
    const score = this.state.score
    this.setState({
      score: score + 1
    })

    this.socket.emit('successful guess', {user_id: this.user_id})
  }

  render() {
    const mappedUsers = this.state.users.map((e, i) => {
      return(
        <p className="users-in-lobby" key={i}>{e}</p>
      )
    })
    return (
    <div className="lobby">
      <div className="row">
        <Canvas
        lobby={this.props.match.params.lobby_id}
        socket={this.socket}/>
        <div className="users">
        <ul>{mappedUsers}</ul>
          <div className="guesses"></div>
          
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
