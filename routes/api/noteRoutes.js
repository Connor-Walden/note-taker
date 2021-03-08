const router = require('express').Router();
const { SlowBuffer } = require('buffer');
const fs = require('fs');
const path = require('path');

// Write a object to the database file.
async function writeToDB(content) {
  try {
    await fs.writeFileSync(path.join(__dirname, '../../db/db.json'), JSON.stringify(content));
  } catch(err) {
    console.log('Could not write to file :(' + err);  
  }
}

// Read a database file to a object.
async function readFromDB() {
  return await JSON.parse(fs.readFileSync(path.join(__dirname, '../../db/db.json')));
}

// CREATE
router.post('/', async (req, res) => {
  const result = await readFromDB()
  result.push(req.body);
  await writeToDB(result);

  res.status(200).json({ message: "OK" });
});

// READ
router.get('/', async (req, res) => {
  const result = await readFromDB()

  res.status(200).json(result);
});

// UPDATE
router.post('/:id', async (req, res) => {
  const noteId = req.params.id;

  try {
    const dbObj = await readFromDB()

    for (let i = 0; i < dbObj.length; i++) {
      if (dbObj[i].id == noteId) {
        dbObj[i].title = req.body.title;
        dbObj[i].text = req.body.text;

        await writeToDB(dbObj);
        res.status(200).json({ message: "Successfully updated note with ID: " + noteId });
      }
    }

    res.status(404).json({ message: "Note not found with ID: " + noteId });
  } catch (err) {
    res.status(500).json({ message: "Server error... Couldn't update note.", err: err });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  const noteId = req.params.id;

  try {
    const dbObj = await readFromDB();

    for (let i = 0; i < dbObj.length; i++) {
      if (dbObj[i].id == noteId) {
        dbObj.splice(i, 1);
        await writeToDB(dbObj);
        res.status(200).json({ message: "Successfully deleted note with ID: " + noteId });
        return;
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Server error... Couldn't delete note." });
  }
});

module.exports = router;