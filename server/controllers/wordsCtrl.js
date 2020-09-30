module.exports = {
  getWords: async (req, res) => {
    const db = req.app.get("db");

    const words = await db.get_words();

    res.status(200).send(words);
  },
  createWord: async (req, res) => {
    const db = req.app.get("db");

    const { word } = req.body;

    if (word) {
      res.status(409).send("Word already exists");
    } else {
      const newWord = await db.create_word([word]);
      res.status(200).send(newWord);
    }
  },
  deleteWord: async (req, res) => {
    const db = req.app.get("db");

    const { word_id } = req.params;

    await db.delete_word([word_id]);

    const words = await db.get_words();

    res.status(200).send(words);
  },
};
