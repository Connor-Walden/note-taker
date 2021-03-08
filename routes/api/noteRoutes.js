const router = require('express').Router();
const fs = require('fs');

// Write a object to the database file.
async function writeToDB(content) {
  await fs.writeFileSync('/db/db.json', JSON.stringify(content));
}

// Read a database file to a object.
async function readFromDB() {
  return await JSON.parse(fs.readFileSync('/db/db.json'));
}

// CREATE
router.post('/notes', async (req, res) => {
  await writeToDB(req.body)

  console.log('Database updated!');

  res.status(200).json({ message: "OK" });
});

// READ
router.get('/notes', async (req, res) => {
  const result = await readFromDB()

  console.log('Got all note data!');

  res.status(200).json(JSON.parse(result));
});

// UPDATE
router.post('/notes/:id', async (req, res) => {
  const noteId = req.params.id;

  try {
    const dbObj = readFromDB()
    dbObj[noteId] = req.body;
    await writeToDB(dbObj);
  } catch (err) {
    res.status(500).json({ message: "Server error... Couldn't update note.", body: req.body });
  }

  res.status(200).send("Success!");
});

// DELETE
router.delete('/notes/:id', async (req, res) => {
  const noteId = req.params.id;

  try {
    const dbObj = readFromDB()
    const newArr = remove(dbObj[noteId]);
    await writeToDB(newArr);
  } catch (err) {
    res.status(500).json({ message: "Server error... Couldn't delete note." });
  }

  res.status(200).json(newArr);
});

module.exports = router;