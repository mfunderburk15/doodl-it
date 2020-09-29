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
  createLobby: async (req, res) => {
    /*
    xI need to access the db
    xI need to destructure user info off of req.session
    xI need to destructure lobby info off of req.params
    xI want to create the lobby with create_lobby
    I will need to update the user's is_creator and lobby_id to show the user joined the lobby 
    */

    const db = req.app.get("db");

    const { user_id } = req.session.user;
    const { lobby_name, lobby_img } = req.body;

    const lobby = await db.create_lobby([lobby_name, lobby_img]);

    const user = await db.join_created_lobby([user_id, lobby[0].lobby_id]);
    res.status(200).send(lobby);
  },
  joinLobby: async (req, res) => {
    const db = req.app.get("db");

    const { lobby_id } = req.params;

    const { user_id } = req.session.user;

    const user = await db.join_lobby([user_id, lobby_id]);

    res.status(200).send(user);
  },
  deleteLobby: async (req, res) => {},
};
