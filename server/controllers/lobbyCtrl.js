const bcrypt = require("bcryptjs");
module.exports = {
  createLobby: async (req, res) => {
    const db = req.app.get("db");
    const { lobby_name, lobby_img } = req.body;
    const [newLobby] = await db.create_lobby([lobby_name, lobby_img]);
    res.status(200).send(newLobby);
  },
  getLobbies: async (req, res) => {},
  getLobbyById: async (req, res) => {},
  deleteLobby: async (req, res) => {},
};
