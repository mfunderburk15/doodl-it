require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const socket = require("socket.io");
const authCtrl = require("./controllers/authCtrl");
const lobbyCtrl = require("./controllers/lobbyCtrl");
const wordsCtrl = require("./controllers/wordsCtrl");

const app = express();
const { CONNECTION_STRING, SERVER_PORT, SESSION_SECRET } = process.env;

app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 },
  })
);

//was running into an error where my massive and sockets were looking at the same server port.  I had to move app.listen outside of massive and declare it to server
const server = app.listen(SERVER_PORT, () =>
  console.log(`This server is looking at port: ${SERVER_PORT}`)
);

// declared io from the sockets.io library and set it equal to socket that takes in my server declared earlier, this way socket.io looks at my server along with app.listen, instead of looking at the same port seprately.
const io = socket(server);

massive({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
}).then((dbInstance) => {
  app.set("db", dbInstance);
  console.log("DB Works!");
});

let rooms = [] // Those are the rooms currently used
let emptyRoom = {
    lobby_id: null,
    players: [{
        username:"",
        score: 0,
        is_creator: false
    }],
    drawHistory: [],
    currentRound:0,
    words:[],
    currentWord: "",
    points: []
};

let room = emptyRoom

let users = {}

io.on('connection', (socket) => {
  io.emit('userlist', users)

  socket.on('initiate lobby', (data) => {
    room = data;
    console.log('initiate')
    console.log(room)
  })

  socket.on('finish drawing', (data) => {
    console.log('finish drawing')
    socket.to(data.lobby).emit('emit draw finish', data)
  })

  

  //if someone leaves the component
  socket.on('leave', (data) => {
    for(let i=0; i < users[data.lobby].length; i++){
      if(users[data.lobby][i] === data.name){
        users[data.lobby].splice(i,1)
      }
    }
    socket.leave(data.lobby)
    console.log(users)
    io.in(data.lobby).emit('member leave', users[data.lobby])
  })

  socket.on('join userlist', (data) => {
    socket.username = data.name;
    socket.join(data.lobby);
    if(users[data.lobby]){
      users[data.lobby].push(socket.username)
    }else{
      users[data.lobby] = [socket.username]
    }
  console.log(`${socket.username} has joined. ID: ${data.lobby}`);
    io.in(data.lobby).emit('member join', users[data.lobby])
  })
  

  //Setting up join events on the socket, I want the username to be pushed onto the users array of the socket and logging the info
  socket.on('join', (data) => {
    room.players.push({
      username: data.name,
      score: 0,
      is_creator: false
    })
    console.log('emitting joined')
    socket.broadcast.emit('joined', room)
    console.log('emitted joined')
  });

});

//Auth endpoints
app.post("/api/auth/register", authCtrl.register);
app.post("/api/auth/login", authCtrl.login);
app.post("/api/auth/logout", authCtrl.logout);
app.get("/api/auth/me", authCtrl.me);

//lobby endpoints
app.post("/api/lobby/create", lobbyCtrl.createLobby);
app.get("/api/lobby/getlobbies", lobbyCtrl.getLobbies);
app.put("/api/lobby/joinlobby/:lobby_id", lobbyCtrl.joinLobby);
app.put("/api/lobby/leavelobby/", lobbyCtrl.leaveLobby);
app.delete("/api/lobby/delete/:lobby_id", lobbyCtrl.deleteLobby);

//word endpoints
app.get("/api/words/get", wordsCtrl.getWords);
app.post("/api/words/create", wordsCtrl.createWord);
app.delete("/api/words/delete/:word_id", wordsCtrl.deleteWord);
