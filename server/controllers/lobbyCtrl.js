module.exports = {
  getLobbies: async (req, res) => {
    const db = req.app.get("db");

    const lobbies = await db.get_all_lobbies();

    res.status(200).send(lobbies);
  },
  createLobby: async (req, res) => {
    const db = req.app.get("db");

    const {
      user_id,
      username,
      user_img,
      is_admin,
      is_creator,
      lobby_id,
    } = req.session.user;
    const { lobby_name, lobby_img } = req.body;

    const lobby = await db.create_lobby([lobby_name, lobby_img]);

    await db.join_created_lobby([user_id, lobby[0].lobby_id]);

    const [user] = await db.me(
      user_id,
      username,
      user_img,
      is_admin,
      is_creator,
      lobby_id
    );

    req.session.user = user;
    res.status(200).send(lobby);
  },
  joinLobby: async (req, res) => {
    const db = req.app.get("db");

    const {
      user_id,
      username,
      user_img,
      is_admin,
      is_creator,
      lobby_id,
    } = req.session.user;

    await db.join_lobby([user_id, req.params.lobby_id]);

    const [user] = await db.me(
      user_id,
      username,
      user_img,
      is_admin,
      is_creator,
      lobby_id
    );

    req.session.user = user;

    res.status(200).send(user);
  },
  leaveLobby: async (req, res) => {
    const db = req.app.get("db");

    const {
      user_id,
      username,
      user_img,
      is_admin,
      is_creator,
      lobby_id,
    } = req.session.user;

    await db.leave_lobby([user_id]);

    const [user] = await db.me(
      user_id,
      username,
      user_img,
      is_admin,
      is_creator,
      lobby_id
    );

    req.session.user = user;

    res.status(200).send(user);
  },
  deleteLobby: async (req, res) => {
    const db = req.app.get("db");

    const {
      user_id,
      username,
      user_img,
      is_admin,
      is_creator,
      lobby_id,
    } = req.session.user;

    await db.leave_lobby([user_id]);

    const [user] = await db.me(
      user_id,
      username,
      user_img,
      is_admin,
      is_creator,
      lobby_id
    );

    req.session.user = [user];

    await db.delete_lobby([req.params.lobby_id]);

    const lobbies = await db.get_all_lobbies();
    res.status(200).send(lobbies);
  },
};
