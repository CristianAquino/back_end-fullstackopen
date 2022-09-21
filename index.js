require("dotenv").config();
require("./mongo");
const express = require("express");
const morgan = require("morgan");
const app = express();
const Note = require("./models/Note");
const handleErrors = require("./middleware/handleErrors");

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/notes", (req, res) => {
  Note.find({}).then((note) => {
    res.send(note);
  });
});

app.post("/api/notes", (req, res) => {
  const body = req.body;
  const newNote = new Note({ ...body, date: new Date() });
  newNote.save().then((savedNote) => res.send(savedNote));
});

app.get("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.send(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  Note.findByIdAndUpdate(id, body, { new: true })
    .then((note) => res.send(note))
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;
  Note.findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

// middleware
app.use(handleErrors);

app.listen(process.env.PORT, () => {
  console.log("http://localhost:3000/");
});
