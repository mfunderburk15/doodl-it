module.exports = {
  getLobbies: async (req, res) => {
    const db = req.app.get("db");

    const { search } = req.query;

    const lobbies = await db.get_lobbies();

    if (search) {
      const lowerSearch = search.toLowerCase();
      const filteredLobbies = lobbies.filter((lobby) =>
        lobby.lobby_name.toLowerCase().includes(lowerSearch)
      );
      return res.status(200).send(filteredLobbies);
    } else {
      return res.status(200).send(lobbies);
    }
  },
  createLobby: async (req, res) => {},
  getLobbyById: async (req, res) => {},
  deleteLobby: async (req, res) => {},
};
